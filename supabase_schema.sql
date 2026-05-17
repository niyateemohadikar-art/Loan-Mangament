-- Supabase schema for Loan Management app
-- Run this in Supabase > SQL editor > New query

create table if not exists users (
  id serial primary key,
  name varchar(100) not null,
  email varchar(150) unique not null,
  password text not null,
  role varchar(20) not null default 'borrower' check (role in ('borrower', 'loan_officer', 'admin')),
  phone varchar(15),
  address text,
  city varchar(100),
  state varchar(100),
  pincode varchar(10),
  date_of_birth date,
  pan_number varchar(10),
  aadhaar_number varchar(12),
  profile_image text,
  is_active boolean default true,
  reset_token text,
  reset_token_expires timestamp,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists loan_applications (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  loan_type varchar(50) not null check (loan_type in ('personal', 'education', 'vehicle', 'business', 'home')),
  loan_amount numeric(15, 2) not null,
  interest_rate numeric(5, 2) not null default 12.00,
  tenure_months integer not null,
  monthly_emi numeric(15, 2),
  total_interest numeric(15, 2),
  total_amount numeric(15, 2),
  purpose text,
  employment_type varchar(30) check (employment_type in ('salaried', 'self_employed', 'business', 'freelancer')),
  employer_name varchar(200),
  monthly_income numeric(15, 2),
  annual_income numeric(15, 2),
  experience_years integer,
  status varchar(30) default 'submitted' check (status in ('draft', 'submitted', 'under_review', 'verified', 'approved', 'rejected', 'disbursed', 'closed')),
  officer_id integer references users(id),
  officer_remarks text,
  rejection_reason text,
  approved_at timestamp,
  disbursed_at timestamp,
  credit_score integer,
  risk_level varchar(20) check (risk_level in ('low', 'medium', 'high', 'very_high')),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists documents (
  id serial primary key,
  loan_id integer references loan_applications(id) on delete cascade,
  user_id integer references users(id) on delete cascade,
  document_type varchar(50) not null check (document_type in ('aadhaar', 'pan', 'salary_slip', 'bank_statement', 'address_proof', 'photo', 'other')),
  file_name varchar(255) not null,
  file_url text not null,
  file_size integer,
  mime_type varchar(50),
  is_verified boolean default false,
  verified_by integer references users(id),
  verified_at timestamp,
  remarks text,
  created_at timestamp default current_timestamp
);

create table if not exists emi_schedules (
  id serial primary key,
  loan_id integer references loan_applications(id) on delete cascade,
  emi_number integer not null,
  due_date date not null,
  emi_amount numeric(15, 2) not null,
  principal_component numeric(15, 2) not null,
  interest_component numeric(15, 2) not null,
  outstanding_balance numeric(15, 2) not null,
  payment_status varchar(20) default 'pending' check (payment_status in ('pending', 'paid', 'overdue', 'partially_paid')),
  paid_amount numeric(15, 2) default 0,
  paid_date timestamp,
  penalty_amount numeric(15, 2) default 0,
  created_at timestamp default current_timestamp
);

create table if not exists payments (
  id serial primary key,
  loan_id integer references loan_applications(id) on delete cascade,
  emi_id integer references emi_schedules(id),
  user_id integer references users(id) on delete cascade,
  stripe_payment_id text,
  stripe_session_id text,
  amount numeric(15, 2) not null,
  payment_method varchar(30),
  payment_status varchar(20) default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id varchar(100),
  receipt_url text,
  payment_date timestamp default current_timestamp,
  created_at timestamp default current_timestamp
);

create table if not exists notifications (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  title varchar(200) not null,
  message text not null,
  type varchar(30) check (type in ('emi_reminder', 'payment_success', 'loan_approved', 'loan_rejected', 'document_verified', 'general', 'warning')),
  is_read boolean default false,
  link text,
  created_at timestamp default current_timestamp
);

create table if not exists defaulters (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  loan_id integer references loan_applications(id) on delete cascade,
  emi_id integer references emi_schedules(id),
  overdue_amount numeric(15, 2) not null,
  penalty_amount numeric(15, 2) default 0,
  days_overdue integer default 0,
  status varchar(20) default 'active' check (status in ('active', 'resolved', 'legal')),
  reminder_sent boolean default false,
  last_reminder_date timestamp,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists audit_logs (
  id serial primary key,
  user_id integer references users(id),
  action varchar(100) not null,
  entity_type varchar(50),
  entity_id integer,
  details jsonb,
  ip_address varchar(45),
  created_at timestamp default current_timestamp
);

create index if not exists idx_loans_user on loan_applications(user_id);
create index if not exists idx_loans_status on loan_applications(status);
create index if not exists idx_emi_loan on emi_schedules(loan_id);
create index if not exists idx_emi_status on emi_schedules(payment_status);
create index if not exists idx_payments_loan on payments(loan_id);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_defaulters_user on defaulters(user_id);
