export type Chat = {
  id: string;
  github_repo_id: string;
  created_at: Date;
  owner_id?: string;
  repo_owner: string;
  repo_name: string;
  repo_description?: string | null;
  repo_data_last_update: Date;
};

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

export type Member = {
  id: string;
  user_id: string;
  chat_id: string;
  nickname?: string;
  user: User;
};

export type MessageType = {
  id: string;
  chat_id: string;
  content: string;
  edited_at?: string;
  created_at: string;
  user: User;
};
