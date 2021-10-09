-- Table: public.chats

-- DROP TABLE public.chats;

CREATE TABLE IF NOT EXISTS public.chats
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    github_repo_id bigint NOT NULL,
    owner_id uuid,
    repo_owner character varying COLLATE pg_catalog."default" NOT NULL,
    repo_name character varying COLLATE pg_catalog."default" NOT NULL,
    repo_description text COLLATE pg_catalog."default",
    repo_data_last_update timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT chats_pkey PRIMARY KEY (id),
    CONSTRAINT chats_github_repo_id_key UNIQUE (github_repo_id),
    CONSTRAINT chats_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.chats
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.chats TO anon;

GRANT ALL ON TABLE public.chats TO authenticated;

GRANT ALL ON TABLE public.chats TO postgres;

GRANT ALL ON TABLE public.chats TO service_role;

GRANT ALL ON TABLE public.chats TO supabase_admin;
