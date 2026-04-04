# Supabase Setup

This project uses Supabase for auth, database, and storage. The client and server helpers read two public env vars:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## 1) Create a Supabase project

1. Go to https://supabase.com and create a new project.
2. In the project dashboard, open Settings -> API.
3. Copy the Project URL and anon public key.

## 2) Configure local env

Create a .env file at the project root (or update the existing one) with:

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

These are used by:

- src/lib/supabase/client.ts
- src/lib/supabase/server.ts

## 3) Enable Google OAuth (Supabase Auth)

This app uses Supabase Auth with Google as the provider.

### A) Configure Google Cloud

1. Go to https://console.cloud.google.com and create/select a project.
2. Configure the OAuth consent screen (External is fine for local dev).
3. Create OAuth client credentials (Web application).
4. Add this Authorized redirect URI (Supabase callback):

```
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

### B) Enable Google provider in Supabase

1. In Supabase, go to Authentication -> Providers -> Google.
2. Enable Google and paste the Client ID and Client Secret.

### C) Set site and redirect URLs in Supabase

In Supabase, go to Authentication -> URL Configuration and set:

- Site URL: http://localhost:3000 (or your deployed URL)
- Additional Redirect URLs:
  - http://localhost:3000/auth/callback
  - https://YOUR_DEPLOYED_DOMAIN/auth/callback

### D) Match the app redirect URL

The Google login uses a hardcoded `redirectTo` URL. Update it to match
your environment or make it env-driven if needed:

- [src/app/login/page.tsx](src/app/login/page.tsx#L13)


## 4) Align database schema (specifics)

The TypeScript types live in src/types/database.ts. Your Supabase schema should match the checklist below.

### Enums

Create these enums:

- user_role: student, convener, admin, committee
- resource_category: PYQ, Lecture Notes, Lab Manual, Tutorial, Reference Book, Other
- opportunity_type: Research Internship, Corporate Internship, Full-Time Placement, Exchange Program

### Tables

profiles

- id uuid primary key
- full_name text not null
- roll_number text null
- entry_year integer null
- role user_role not null
- avatar_url text null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

courses

- id uuid primary key
- code text not null
- name text not null
- semester integer not null
- credits integer null
- is_active boolean not null default true
- created_at timestamptz not null default now()

feedback

- id uuid primary key
- course_id uuid not null references courses(id)
- rating integer not null
- stop_feedback text null
- start_feedback text null
- continue_feedback text null
- week_number integer null
- academic_year text null
- created_at timestamptz not null default now()

resources

- id uuid primary key
- course_id uuid not null references courses(id)
- uploaded_by uuid not null references profiles(id)
- category resource_category not null
- title text not null
- description text null
- storage_path text not null
- file_type text not null
- file_size_kb integer null
- download_count integer not null default 0
- is_approved boolean not null default false
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

announcements

- id uuid primary key
- title text not null
- event_date date null
- description text not null
- author_name text not null
- added_by uuid null references profiles(id)
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

seniors

- id uuid primary key
- type opportunity_type not null
- company_or_uni text not null
- role_title text not null
- location text null
- stipend text null
- duration text null
- skills_required text[] not null default '{}'
- description text null
- application_link text null
- contact_name text null
- contact_roll text null
- contact_email text null
- added_by uuid null references profiles(id)
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

### View

feedback_summary (view)

- course_code text
- course_name text
- semester integer
- total_responses integer
- avg_rating numeric
- positive_count integer
- negative_count integer

### SQL you can paste into the Supabase SQL editor

create extension if not exists pgcrypto;

create type user_role as enum ('student', 'convener', 'admin', 'committee');
create type resource_category as enum ('PYQ', 'Lecture Notes', 'Lab Manual', 'Tutorial', 'Reference Book', 'Other');
create type opportunity_type as enum ('Research Internship', 'Corporate Internship', 'Full-Time Placement', 'Exchange Program');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  roll_number text,
  entry_year integer,
  role user_role not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  semester integer not null,
  credits integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id),
  rating integer not null,
  stop_feedback text,
  start_feedback text,
  continue_feedback text,
  week_number integer,
  academic_year text,
  created_at timestamptz not null default now()
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id),
  uploaded_by uuid not null references profiles(id),
  category resource_category not null,
  title text not null,
  description text,
  storage_path text not null,
  file_type text not null,
  file_size_kb integer,
  download_count integer not null default 0,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  description text not null,
  author_name text not null,
  added_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table seniors (
  id uuid primary key default gen_random_uuid(),
  type opportunity_type not null,
  company_or_uni text not null,
  role_title text not null,
  location text,
  stipend text,
  duration text,
  skills_required text[] not null default '{}',
  description text,
  application_link text,
  contact_name text,
  contact_roll text,
  contact_email text,
  added_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create view feedback_summary as
select
  c.code as course_code,
  c.name as course_name,
  c.semester,
  count(f.id) as total_responses,
  avg(f.rating)::numeric(10,2) as avg_rating,
  count(*) filter (where f.rating >= 4) as positive_count,
  count(*) filter (where f.rating <= 2) as negative_count
from feedback f
join courses c on c.id = f.course_id
group by c.code, c.name, c.semester;

## 5) Run the app

npm run dev

Open http://localhost:3000

## Optional: Regenerate types

If you use the Supabase CLI, you can regenerate the types to match your schema:

supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/database.ts

## Notes

- The anon key is safe for browser use; do not put service role keys in the client.
- If you regenerate types from Supabase, update src/types/database.ts to keep it in sync.
