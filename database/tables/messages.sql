-- Table: public.messages

-- DROP TABLE public.messages;

CREATE TABLE IF NOT EXISTS public.messages
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    chat_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type integer NOT NULL DEFAULT 1,
    content text COLLATE pg_catalog."default" NOT NULL,
    mentions uuid[],
    parent_message uuid,
    edited_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id)
        REFERENCES public.chats (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_parent_message_fkey FOREIGN KEY (parent_message)
        REFERENCES public.messages (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.messages
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.messages TO anon;

GRANT ALL ON TABLE public.messages TO authenticated;

GRANT ALL ON TABLE public.messages TO postgres;

GRANT ALL ON TABLE public.messages TO service_role;

GRANT ALL ON TABLE public.messages TO supabase_admin;
