import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";
import { IS_SERVER, NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from "env";
import { Chat } from "types";

/**
 * If running client side, the supabase client will use the anon key, and RLS will be enforced.
 * If running on SSR functions or /api pages, the service key will be used, granting full access to tables
 */

type SupabaseTables = "chats" | "members" | "messages" | "users";

interface TypedSupabaseClient extends SupabaseClient {
  from: <T = any>(table: SupabaseTables) => SupabaseQueryBuilder<T>;
}

export const supabase: TypedSupabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  IS_SERVER ? SUPABASE_SERVICE_KEY : NEXT_PUBLIC_SUPABASE_KEY
);

interface SupabaseGenericParams<T> {
  selectFields?: (keyof T)[];
  matchParams?: { [k in keyof Partial<T>]: string };
}

export const getChats = async (options: SupabaseGenericParams<Chat> = {}) =>
  await supabase
    .from<Chat>("chats")
    .select(options.selectFields?.join(",") || "*")
    .match(options.matchParams || {});

export const getChatByRepoOwnerAndName = async (
  owner: string,
  name: string,
  options: SupabaseGenericParams<Chat> = {}
) =>
  await supabase
    .from<Chat>("chats")
    .select(options.selectFields?.join(",") || "*")
    .ilike("repo_owner", owner)
    .ilike("repo_name", name);

export const createChat = async ({
  github_repo_id,
  repo_owner,
  repo_name,
  repo_description,
}: Pick<Chat, "github_repo_id" | "repo_owner" | "repo_name" | "repo_description">) =>
  await supabase.from<Chat>("chats").insert([
    {
      github_repo_id,
      repo_owner,
      repo_name,
      repo_description,
    },
  ]);

export const updateChat = async (
  { github_repo_id, repo_owner, repo_description, repo_name }: Partial<Chat>,
  options: SupabaseGenericParams<Chat>
) =>
  await supabase
    .from<Chat>("chats")
    .insert([
      {
        github_repo_id,
        repo_owner,
        repo_name,
        repo_description,
      },
    ])
    .select(options.selectFields?.join(",") || "*")
    .match(options.matchParams || {});
