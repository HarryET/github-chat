CREATE SCHEMA IF NOT EXISTS public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    username text NOT NULL,
    avatar_url text NOT NULL,
    nickname text NULL,
    bio text NULL,
    private_key text NULL, -- encrypted private key which can be recovered using a password
    flags integer NOT NULL DEFAULT 0
);

-- example used in comments: harryet/github-chat
CREATE TABLE IF NOT EXISTS public.repositories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    owner text NOT NULL, -- repo owner: harryet
    name text NOT NULL, -- repo name: github-chat
    url text NOT NULL, -- repo url: github.com/harryet/github-chat
    flags integer NOT NULL DEFAULT 0 -- e.g. verified, archived, etc.
);

CREATE TABLE IF NOT EXISTS public.repository_messages (
    id uuid NOT NULL DEFAULT uuid_generate_v4 (),
    profile_id uuid NOT NULL REFERENCES public.profiles (id),
    repository_id uuid NOT NULL REFERENCES public.repositories (id),
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    flags integer NOT NULL DEFAULT 0,
    PRIMARY KEY (id, profile_id, repository_id)
);

CREATE TABLE IF NOT EXISTS public.dm_channels (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4 (),
    is_e2e boolean NOT NULL DEFAULT FALSE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dm_channel_members (
    id uuid NOT NULL DEFAULT uuid_generate_v4 (),
    dm_channel_id uuid NOT NULL REFERENCES public.dm_channels (id),
    profile_id uuid NOT NULL REFERENCES public.profiles (id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id, dm_channel_id, profile_id)
);
