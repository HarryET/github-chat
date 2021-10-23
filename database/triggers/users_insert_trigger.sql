CREATE OR REPLACE FUNCTION
  public.users_insert_trigger_fnc()
  RETURNS TRIGGER AS
  $$
  BEGIN
    INSERT INTO public.users (id, username, display_name, avatar_url)
    VALUES (
      NEW.id,
      LOWER(NEW.raw_user_meta_data ->> 'user_name'),
      NEW.raw_user_meta_data ->> 'user_name',
      NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS users_insert_trigger on auth.users;

CREATE TRIGGER
  users_insert_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.users_insert_trigger_fnc();
