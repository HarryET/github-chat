CREATE OR REPLACE VIEW realtime_messages AS SELECT
       msg.id as id,
       msg.type as type,
       msg.content as content,
       msg.created_at as created_at,
       msg.created_at as edited_at,
       msg.mentions as mentions,
       msg.files as files,
       usr.id as author_id,
       usr.username as author_username,
       usr.avatar_url as author_avatar_url,
       usr.flags as author_flags,
       chat.id as chat_id,
       chat.repo_name as chat_repo_name,
       chat.repo_owner as chat_repo_owner
FROM public.messages as msg
INNER JOIN users usr on usr.id = msg.user_id
INNER JOIN chats chat on chat.id = msg.chat_id;