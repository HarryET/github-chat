import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';
import { Octokit } from "@octokit/rest";
import { error, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
    const { session, supabaseClient } = await getSupabase(event)
    const { params: { owner, repo } } = event;

    let repoRow = await supabaseClient
        .from("repositories")
        .select("*")
        .eq("owner", owner)
        .eq("name", repo)
        .single()

    if (repoRow.error) {
        throw error(500, repoRow.error.message)
    }

    if (!repoRow.data) {
        const octokit = new Octokit({});

        const repoData = await octokit.rest.repos
          .get({
            owner,
            repo
          })
          .then(({ data }) => data)
          .catch((e) => {
            console.error(e);
            return undefined;
          });

        // Repository does not exist in Github
        if (repoData == undefined) {
            throw redirect(303, `/repo-not-found?owner=${owner}&repo=${repo}`)
        }

        repoRow = await supabaseClient
            .from("repositories")
            .select("*")
            .eq("github_id", repoData.id.toString())
            .single();

        if (repoRow.data) {
            // TODO update row
        } else {
            repoRow = await supabaseClient.from("repositories").insert({
                github_id: repoData.id.toString(),
                owner: owner.toLowerCase(),
                name: repoData.name,
                url: repoData.html_url
            }).select("*").single();
        }
    }

    if (!repoRow.data) {
        throw error(500, "Internal Server Error")
    }

    return {
        hasAuth: session != null,
        repo: repoRow.data
    };
}) satisfies PageLoad;
