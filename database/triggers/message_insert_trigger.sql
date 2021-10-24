CREATE OR REPLACE FUNCTION
  public.message_insert_trigger_fnc()
  RETURNS TRIGGER AS
  $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM members m WHERE m.user_id = NEW.user_id) THEN
      INSERT INTO public.members (user_id, chat_id) VALUES (NEW.user_id, NEW.chat_id);
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS message_insert_trigger on public.messages;

CREATE TRIGGER 
  message_insert_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE PROCEDURE 
    public.message_insert_trigger_fnc();
