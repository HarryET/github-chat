CREATE OR REPLACE FUNCTION public.user_join_repository_trigger_fnc ()
    RETURNS TRIGGER
    AS $$
BEGIN
    INSERT INTO public.repository_memberships (repository_id, profile_id)
        VALUES (NEW.repository_id, NEW.profile_id)
    ON CONFLICT
        DO NOTHING;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_join_repository_trigger ON public.messages;

CREATE TRIGGER user_join_repository_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE PROCEDURE public.user_join_repository_trigger_fnc ();
