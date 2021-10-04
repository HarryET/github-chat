export type Chat = {
  id: string;
  github_repo_id: string;
  // created_at: Date;
  // owner_id: string;
  repo_owner: string;
  repo_name: string;
  // repo_description: string;
  // repo_data_last_update: Date;
};

type User = {
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
  author: Member;
  content: string;
  edited_at?: Date;
  created_at: Date;
};
