CREATE OR REPLACE FUNCTION
  public.message_insert_trigger_fnc()
  RETURNS TRIGGER AS
  $$
  BEGIN
    IF NOT (SELECT EXISTS (SELECT * FROM members WHERE user_id = NEW.user_id AND chat_id = NEW.chat_id)) THEN
        INSERT INTO public.members (user_id, chat_id) VALUES (NEW.user_id, NEW.chat_id);
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER 
  message_insert_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE PROCEDURE 
    public.message_insert_trigger_fnc();
