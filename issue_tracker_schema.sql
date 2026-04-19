create type issue_status as enum ('open', 'seen', 'resolved');
create type issue_sender_type as enum ('student', 'convener');

alter table feedback
  add column if not exists issue_code text,
  add column if not exists status issue_status default 'open',
  add column if not exists updated_at timestamptz default now();

update feedback
set issue_code = coalesce(issue_code, 'NX-' || upper(substring(replace(id::text, '-', '') from 1 for 6))),
    status = coalesce(status, 'open'),
    updated_at = coalesce(updated_at, created_at, now())
where issue_code is null or status is null or updated_at is null;

alter table feedback
  alter column issue_code set not null,
  alter column status set not null,
  alter column updated_at set not null;

create unique index if not exists idx_feedback_issue_code_unique on feedback(issue_code);
create index if not exists idx_feedback_status_updated_at on feedback(status, updated_at desc);

create table if not exists feedback_messages (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references feedback(id) on delete cascade,
  sender_type issue_sender_type not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedback_messages_feedback_id_created_at on feedback_messages(feedback_id, created_at asc);
