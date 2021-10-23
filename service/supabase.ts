import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";
import { IS_SERVER, NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SUPABASE_STORAGE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from "env";
import { ActiveChat, Chat, SupabaseTables, User } from "types";

/**
 * If running client side, the supabase client will use the anon key, and RLS will be enforced.
 * If running on SSR functions or /api pages, the service key will be used, granting full access to tables
 */

interface TypedSupabaseClient extends SupabaseClient {
  from: <T = any>(table: SupabaseTables) => SupabaseQueryBuilder<T>;
}

export const supabase: TypedSupabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  IS_SERVER ? SUPABASE_SERVICE_KEY : NEXT_PUBLIC_SUPABASE_KEY
);

interface SupabaseGenericParams<T> {
  selectFields?: (keyof T)[] | string;
  matchParams?: { [k in keyof Partial<T>]: string };
  count?: number;
}

export const bannerUrl = (user: User) => {
  const url = user.banner != null ? NEXT_PUBLIC_SUPABASE_STORAGE_URL + `/object/public/banners/${user.banner}.webp` : null;
  return url;
}

export const userByUsername = (username: string, options: SupabaseGenericParams<User> = {}) => {
  const query = supabase
    .from<User>("users")
    .select("*")
    .eq("username", username.toLowerCase())
    .limit(1);

  return query;
}

export const getChats = (options: SupabaseGenericParams<Chat> = {}) => {
  const { selectFields, matchParams, count } = options;

  const selectString = typeof selectFields === "string" ? selectFields : selectFields?.join(",") || "*";

  const query = supabase
    .from<Chat>("chats")
    .select(selectString)
    .match(matchParams || {});

  if (count) query.limit(count);

  return query;
};

export const getChatByRepoOwnerAndName = (owner: string, name: string, options: SupabaseGenericParams<Chat> = {}) =>
  getChats(options).ilike("repo_owner", owner).ilike("repo_name", name);

export const getActiveChats = () => supabase.from<ActiveChat>("active_chats");

export const createChat = ({
  github_repo_id,
  repo_owner,
  repo_owner_avatar,
  repo_name,
  repo_description,
}: Pick<Chat, "github_repo_id" | "repo_owner" | "repo_name" | "repo_description" | "repo_owner_avatar">) =>
  supabase.from<Chat>("chats").insert([
    {
      github_repo_id,
      repo_owner,
      repo_owner_avatar,
      repo_name,
      repo_description,
    },
  ]);

export const updateChat = (
  { github_repo_id, repo_owner, repo_description, repo_name }: Partial<Chat>,
  options: SupabaseGenericParams<Chat>
) =>
  supabase
    .from<Chat>("chats")
    .update({
      github_repo_id,
      repo_owner,
      repo_name,
      repo_description,
    })
    .match(options.matchParams || {});
