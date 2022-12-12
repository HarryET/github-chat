export const MessageQuery = `
id,
content,
created_at,
updated_at,
user: profiles!profile_id(
  id,
  username,
  avatar_url,
  nickname,
  flags
),
flags`;

export type Message = {
    id: string;
    user: {
      id: string;
      username: string;
      avatar_url: string;
      nickname: string;
      flags: number;
    };
    content: string;
    created_at: string;
    updated_at: string;
    flags: number;
  };
