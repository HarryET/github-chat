export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dm_channel_members: {
        Row: {
          id: string
          dm_channel_id: string
          profile_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dm_channel_id: string
          profile_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dm_channel_id?: string
          profile_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      dm_channels: {
        Row: {
          id: string
          is_e2e: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          is_e2e?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_e2e?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          profile_id: string
          repository_id: string
          content: string
          created_at: string
          updated_at: string
          flags: number
        }
        Insert: {
          id?: string
          profile_id: string
          repository_id: string
          content: string
          created_at?: string
          updated_at?: string
          flags?: number
        }
        Update: {
          id?: string
          profile_id?: string
          repository_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          flags?: number
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string
          nickname: string | null
          bio: string | null
          private_key: string | null
          flags: number
        }
        Insert: {
          id?: string
          username: string
          avatar_url: string
          nickname?: string | null
          bio?: string | null
          private_key?: string | null
          flags?: number
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string
          nickname?: string | null
          bio?: string | null
          private_key?: string | null
          flags?: number
        }
      }
      repositories: {
        Row: {
          id: string
          owner: string
          name: string
          url: string
          flags: number
          github_id: string
        }
        Insert: {
          id?: string
          owner: string
          name: string
          url: string
          flags?: number
          github_id?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string
          url?: string
          flags?: number
          github_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
