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

export type MessageType = {
  id: string;
  author: {
    id: string;
    username?: string;
    nickname?: string;
    avatar_url: string;
  };
  content: string;
  edited_at?: Date;
  created_at: Date;
};
