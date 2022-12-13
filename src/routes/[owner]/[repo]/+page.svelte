<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import Sidebar from "../../Sidebar.svelte";
  import type { PageData } from "./$types";
  import MessagesList from "./MessagesList.svelte";
  import { MessageQuery } from "./types";
  import { useQuery } from '@sveltestack/svelte-query'
  import { ProfileQuery, type UserProfile } from "../../types";
  import type { PostgrestSingleResponse } from "@supabase/supabase-js";

  export let data: PageData;

  const fetchMeResult = useQuery<PostgrestSingleResponse<UserProfile>>('fetchMe', async () => await supabaseClient.from("profiles").select(ProfileQuery).eq("id", data.session?.user.id ?? "-").single());

  const sendMessage = async (content: string) => {
    let res = await supabaseClient
      .from("messages")
      .insert({
        content: content,
        repository_id: data.repo?.id ?? "-",
        profile_id: data.session?.user.id ?? "-",
      })
      .select(MessageQuery)
      .single();

    console.log(res);

    if (res.data) {
      // @ts-ignore
      messages = [res.data, ...messages];
    }
  };
</script>

<svelte:head>
  <title>{data.repo.owner}/{data.repo.name} | GithubChat</title>
</svelte:head>

<div class="w-full h-full flex flex-col md:flex-row">
  <div class="h-full hidden md:flex">
    <Sidebar profile={$fetchMeResult.data?.data ?? undefined} />
  </div>
  <div class="w-full flex md:hidden">
    <!-- TODO navbar! -->
  </div>
  <div class="w-full">
    <div class="pl-4">
      <MessagesList repository_id={data.repo?.id ?? "-"} />
    </div>
    <!-- TODO input -->
  </div>
</div>
