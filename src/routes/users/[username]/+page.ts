import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
    const { session, supabaseClient } = await getSupabase(event)
    const { params: { username } } = event;

    let row = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single()

    if (row.error) {
        throw error(500, "Internal Server Error")
    }

    if (!row.data) {
        throw error(404, "User Not Found")
    }

    return {
        hasAuth: session != null,
        isMe: session?.user.id == row.data.id,
        user: row.data
    };
}) satisfies PageLoad;
