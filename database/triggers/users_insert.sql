CREATE FUNCTION
  public.users_insert_trigger_fnc()
  RETURNS TRIGGER AS
  $$
  BEGIN
    INSERT INTO public.users (id, username, avatar_url, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'user_name',
      NEW.raw_app_meta_data ->> 'avatar_url', 
      NEW.email
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER 
  users_insert_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE 
    public.users_insert_trigger_fnc();
