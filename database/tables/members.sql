-- Table: public.members

-- DROP TABLE public.members;

CREATE TABLE IF NOT EXISTS public.members
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    joined_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    nickname character varying COLLATE pg_catalog."default",
    typing boolean NOT NULL DEFAULT false,
    permissions bigint NOT NULL DEFAULT '0'::bigint,
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT members_chat_id_fkey FOREIGN KEY (chat_id)
        REFERENCES public.chats (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.members TO anon;

GRANT ALL ON TABLE public.members TO authenticated;

GRANT ALL ON TABLE public.members TO postgres;

GRANT ALL ON TABLE public.members TO service_role;

GRANT ALL ON TABLE public.members TO supabase_admin;
