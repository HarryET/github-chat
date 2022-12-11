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
