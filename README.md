# ReVerie Web

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase credentials
npm run dev
```

---

## Environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Supabase setup

### 1. Storage bucket

Create a public storage bucket named **`doctor-cvs`** in your Supabase dashboard (Storage → New bucket).

### 2. Tables

Run the following SQL in the **SQL Editor** of your Supabase project:

```sql
-- doctor_applications (new table)
create table if not exists public.doctor_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  specialization text not null,
  experience int not null,
  languages text not null,
  bio text not null,
  cv_url text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- profiles (extend if it already exists, or create fresh)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'patient'
    check (role in ('admin','doctor','patient')),
  onboarding_status text default 'incomplete',
  created_at timestamptz not null default now()
);

-- doctor_profiles
create table if not exists public.doctor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  specialization text,
  experience int,
  languages text,
  bio text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','verified','rejected')),
  rating numeric(3,1),
  created_at timestamptz not null default now()
);

-- consumer_profiles
create table if not exists public.consumer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- vr_scenes
create table if not exists public.vr_scenes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

-- appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text,
  doctor_name text,
  session_datetime timestamptz,
  status text not null default 'scheduled'
    check (status in ('scheduled','live','completed','cancelled')),
  vr_scene_title text,
  appointment_link text,
  duration_minutes int,
  created_at timestamptz not null default now()
);
```

### 3. Row-level security (RLS)

Enable RLS on all tables and add a service-role bypass so the API routes work:

```sql
alter table public.doctor_applications enable row level security;
alter table public.profiles enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.consumer_profiles enable row level security;
alter table public.appointments enable row level security;

-- Allow service role full access (used by server-side API routes)
create policy "service role bypass" on public.doctor_applications
  for all using (true) with check (true);

create policy "service role bypass" on public.profiles
  for all using (true) with check (true);

create policy "service role bypass" on public.doctor_profiles
  for all using (true) with check (true);

create policy "service role bypass" on public.consumer_profiles
  for all using (true) with check (true);

create policy "service role bypass" on public.appointments
  for all using (true) with check (true);
```

> For production, replace the permissive policies with proper role-based checks.

### 4. Create an admin user

1. Go to **Authentication → Users** in your Supabase dashboard and invite or create a user.
2. Run this SQL to grant admin role:

```sql
insert into public.profiles (id, email, full_name, role)
values (
  '<paste-user-uuid-here>',
  'admin@yourcompany.com',
  'Admin',
  'admin'
)
on conflict (id) do update set role = 'admin';
```

3. Visit `http://localhost:3000/admin/login` and sign in.

---

## Project structure

```
app/
  page.tsx                  # Landing page (/)
  layout.tsx                # Root layout (Inter font, metadata)
  api/apply/route.ts        # POST /api/apply — doctor application form
  admin/
    layout.tsx              # Passthrough (login lives outside AdminShell)
    page.tsx                # /admin — Dashboard overview
    login/page.tsx          # /admin/login — Auth page
    applications/page.tsx   # /admin/applications
    users/page.tsx          # /admin/users
    doctors/page.tsx        # /admin/doctors
    sessions/page.tsx       # /admin/sessions
components/
  landing/                  # Navbar, Hero, ForDoctors, HowToJoin, DashboardPreview,
  |                         #   ApplicationForm, Footer
  admin/
    AdminShell.tsx          # Server component: auth check + sidebar wrapper
    Sidebar.tsx             # Left nav with badges
    ApplicationsTable.tsx   # Client component for applications page
    DoctorsTable.tsx        # Client component for doctors page
    UsersTable.tsx          # Client component for users page
    SessionsTable.tsx       # Client component for sessions page
  ui/                       # button, badge, input, textarea, label, dialog
lib/
  supabase/client.ts        # Browser Supabase client (anon key)
  supabase/server.ts        # Server Supabase client + service role client
  types.ts                  # TypeScript interfaces
  utils.ts                  # cn() helper
middleware.ts               # Redirects unauthenticated users away from /admin/*
```
