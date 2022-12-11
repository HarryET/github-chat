ALTER TABLE profiles
    ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE profiles
    ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE repositories
    ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE repositories
    ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();
