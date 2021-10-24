CREATE OR REPLACE FUNCTION
    public.message_insert_bot_trigger_fnc()
    RETURNS TRIGGER AS
$$
DECLARE
    bot               bot_members%rowtype;
    bot_http_response http_response;
    bot_response      json;
    event_id          uuid;
BEGIN
    FOR bot IN
        SELECT *
        FROM bot_members as member
        WHERE member.chat_id = NEW.chat_id
          AND member.interactions_url IS NOT NULL
        LOOP
            event_id := uuid_generate_v4();
            -- Store Events in a Log?
            SELECT *
            INTO bot_http_response
            FROM http((
                       'POST',
                       bot.interactions_url,
                       ARRAY [http_header('X-Version'::varchar, 'v1'::varchar), http_header('X-Bot-ID'::varchar, bot.id::varchar), http_header('X-Event-ID'::varchar, event_id::varchar)],
                       'application/json',
                       '{"type": 1,"data": {"id": "' || NEW.id::varchar || '","content": "' || NEW.content ||
                       '","user_id": "' || NEW.user_id::varchar || '","chat_id": "' || NEW.chat_id::varchar || '"}}'
                )::http_request);

            if (bot_http_response.status != 200) THEN
                -- Handle error codes
                CONTINUE;
            end if;

            if (bot_http_response.content_type != 'application/json') THEN
                PERFORM http((
                              'POST',
                              bot.interactions_url,
                              ARRAY [http_header('X-Version'::varchar, 'v1'::varchar), http_header('X-Bot-ID'::varchar, bot.id::varchar), http_header('X-Event-ID'::varchar, event_id::varchar)],
                              'application/json',
                              '{"type": 2,"data": {"error": {"code": "R01", "message": "Invalid response content-type"}}}'
                    )::http_request);
                CONTINUE;
            end if;

            bot_response := bot_http_response.content::json;
            if ((bot_response ->> 'type')::integer == 1 AND bot_response ->> 'data' ->> 'content' IS NOT NULL) THEN
                INSERT INTO public.messages (chat_id, user_id, content)
                VALUES (NEW.chat_id, bot.id, (bot_response ->> 'data' ->> 'content')::varchar);
                CONTINUE;
            ELSE
                PERFORM http((
                              'POST',
                              bot.interactions_url,
                              ARRAY [http_header('X-Version'::varchar, 'v1'::varchar), http_header('X-Bot-ID'::varchar, bot.id::varchar), http_header('X-Event-ID'::varchar, event_id::varchar)],
                              'application/json',
                              '{"type": 2,"data": {"error": {"code": "R02", "message": "Invalid Response Type!"}}}'
                    )::http_request);
                CONTINUE;
            end if;
        END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS message_insert_bot_trigger on public.messages;

CREATE TRIGGER
  message_insert_bot_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.message_insert_bot_trigger_fnc();