create type issue_status as enum ('open', 'seen', 'resolved');
create type issue_sender_type as enum ('student', 'convener');

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  issue_code text not null unique,
  course_id uuid not null references courses(id),
  rating integer not null,
  stop_feedback text,
  start_feedback text,
  continue_feedback text,
  week_number integer,
  academic_year text,
  status issue_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_issues_issue_code on issues(issue_code);
create index if not exists idx_issues_status_updated_at on issues(status, updated_at desc);

create table if not exists issue_messages (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  sender_type issue_sender_type not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_issue_messages_issue_id_created_at on issue_messages(issue_id, created_at asc);
