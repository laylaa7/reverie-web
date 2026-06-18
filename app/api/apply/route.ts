import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function authUserExistsWithEmail(supabase: ReturnType<typeof createServiceClient>, normalizedEmail: string) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    throw error;
  }

  return data.users.some(user => user.email?.toLowerCase().trim() === normalizedEmail);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const specialization = formData.get("specialization") as string;
    const experience = parseInt(formData.get("experience") as string, 10);
    const languages = formData.get("languages") as string;
    const bio = formData.get("bio") as string;
    const cvFile = formData.get("cv") as File | null;

    if (!fullName || !email || !specialization || isNaN(experience) || !languages || !bio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const normalizedEmail = email.toLowerCase().trim();

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (profileLookupError) {
      console.error("Profile lookup error:", profileLookupError);
      return NextResponse.json({ error: "Failed to check existing account" }, { status: 500 });
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: "An account already exists with this email." },
        { status: 409 }
      );
    }

    try {
      const existingAuthUser = await authUserExistsWithEmail(supabase, normalizedEmail);

      if (existingAuthUser) {
        return NextResponse.json(
          { error: "An account already exists with this email." },
          { status: 409 }
        );
      }
    } catch (authLookupError) {
      console.error("Auth user lookup error:", authLookupError);
      return NextResponse.json({ error: "Failed to check existing account" }, { status: 500 });
    }

    const { data: existingApplication, error: applicationLookupError } = await supabase
      .from("doctor_applications")
      .select("id, status")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (applicationLookupError) {
      console.error("Application lookup error:", applicationLookupError);
      return NextResponse.json({ error: "Failed to check existing application" }, { status: 500 });
    }

    if (existingApplication) {
      return NextResponse.json(
        { error: "An application already exists with this email." },
        { status: 409 }
      );
    }

    let cvUrl: string | null = null;

    if (cvFile && cvFile.size > 0) {
      const fileName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const cvBuffer = await cvFile.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("doctor-cvs")
        .upload(fileName, cvBuffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        console.error("CV upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from("doctor-cvs")
        .getPublicUrl(uploadData.path);

      cvUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("doctor_applications")
      .insert({
        full_name: fullName,
        email: normalizedEmail,
        specialization,
        experience,
        languages,
        bio,
        cv_url: cvUrl,
        status: "pending",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
