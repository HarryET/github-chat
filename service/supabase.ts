import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";
import { IS_SERVER, NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SUPABASE_STORAGE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from "env";
import { SupabaseQueryable } from "@github-chat/types";
import { p_Repositories, p_Users } from "@github-chat/views";

/**
 * If running client side, the supabase client will use the anon key, and RLS will be enforced.
 * If running on SSR functions or /api pages, the service key will be used, granting full access to tables
 */

interface TypedSupabaseClient extends SupabaseClient {
  from: <T = any>(table: SupabaseQueryable) => SupabaseQueryBuilder<T>;
}

export const supabase: TypedSupabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  IS_SERVER ? SUPABASE_SERVICE_KEY : NEXT_PUBLIC_SUPABASE_KEY
);

export class SupabaseService {
  public getAvatarURL = (avatar_hash: string): string => {
    return NEXT_PUBLIC_SUPABASE_STORAGE_URL + `/object/public/user-avatars/${avatar_hash}.webp`;
  }

  public getUserById = async (id: string): Promise<p_Users> => {
    const query = await supabase
      .from<p_Users>("p_Users")
      .select("*")
      .eq("id", id)
      .single();
    
    if(query.body == null)
      throw query.error;

    return query.body;
  }

  public getRepository = async (owner_name: string, repo_name: string): Promise<p_Repositories> => {
    const query = await supabase
      .from<p_Repositories>("p_Repositories")
      .select("*")
      .eq("owner_name", owner_name)
      .eq("name", repo_name)
      .single();
    
    if(query.body == null)
      throw query.error;

    return query.body;
  }
}
