export type Chat = {
  id: string;
  github_repo_id: string;
  created_at: Date;
  owner_id?: string;
  repo_owner: string;
  repo_owner_avatar?: string;
  repo_name: string;
  repo_description?: string | null;
  repo_data_last_update: Date;
};

export type RecentChat = {
  id: string;
  repoOwner: string;
  repoName: string;
};

export type User = {
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

export type MentionedMessageType = {
  id: string;
  content: string;
  created_at: string;
  mentions: string[];
  user: User;
  chat: Chat;
};

export type ActiveChat = {
  id: string;
  repo_owner: string;
  repo_name: string;
  content: string;
  user_id: string;
  username: string;
  avatar_url: string;
};

export type SupabaseTables = "chats" | "members" | "messages" | "users" | "active_chats";

export type Mention = { username: string; id: string };

export type Repository = {
  id: string;
  fullName: string;
  owner: string | undefined;
  name: string;
};
