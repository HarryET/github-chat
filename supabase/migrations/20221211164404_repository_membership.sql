-- Table that links repositories to profiles to show membership
CREATE TABLE IF NOT EXISTS public.repository_memberships (
    profile_id uuid NOT NULL REFERENCES public.profiles (id),
    repository_id uuid NOT NULL REFERENCES public.repositories (id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, repository_id)
);
