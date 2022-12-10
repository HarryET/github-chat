CREATE SCHEMA IF NOT EXISTS public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid primary key default uuid_generate_v4(),
    username text not null,
    avatar_url text not null,

    nickname text null,
    bio text null,

    private_key text null, -- encrypted private key which can be recovered using a password

    flags integer not null default 0,
);

-- example used in comments: harryet/github-chat
CREATE TABLE IF NOT EXISTS public.repositories (
    id uuid primary key default uuid_generate_v4(),
    owner text not null, -- repo owner: harryet
    name text not null, -- repo name: github-chat
    url text not null, -- repo url: github.com/harryet/github-chat

    flags integer not null default 0, -- e.g. verified, archived, etc.
);

CREATE TABLE IF NOT EXISTS public.repository_messages (
    id uuid not null default uuid_generate_v4(),
    profile_id uuid not null references public.profiles(id),
    repository_id uuid not null references public.repositories(id),

    content text not null,

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    flags integer not null default 0,

    primary key (id, profile_id, repository_id)
);

CREATE TABLE IF NOT EXISTS public.dm_channels (
    id uuid not null default uuid_generate_v4(),

    is_e2e boolean not null default false,

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
);

CREATE TABLE IF NOT EXISTS public.dm_channel_members (
    id uuid not null default uuid_generate_v4(),
    dm_channel_id uuid not null references public.dm_channels(id),
    profile_id uuid not null references public.profiles(id),

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    primary key (id, dm_channel_id, profile_id)
);
