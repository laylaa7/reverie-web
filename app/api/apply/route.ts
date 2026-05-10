import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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
        email,
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
