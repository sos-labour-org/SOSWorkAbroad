-- Add notes column to applicants table
alter table public.applicants add column if not exists notes text;
