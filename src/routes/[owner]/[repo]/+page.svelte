<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import Sidebar from "../../Sidebar.svelte";
  import type { PageData } from "./$types";
  import MessagesList from "./MessagesList.svelte";
  import { MessageQuery } from "./types";

  export let data: PageData;

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

<div class="w-full h-full flex flex-col md:flex-row">
  <div class="h-full hidden md:flex">
    <Sidebar />
  </div>
  <div class="w-full flex md:hidden">
    <!-- TODO navbar! -->
  </div>
  <div class="w-full">
    <MessagesList repository_id={data.repo?.id ?? "-"} />
    <!-- TODO input -->
  </div>
</div>
