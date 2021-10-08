-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    username text COLLATE pg_catalog."default",
    avatar_url text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.users TO anon;

GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO service_role;

GRANT ALL ON TABLE public.users TO supabase_admin;
