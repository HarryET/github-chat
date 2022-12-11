<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import InfiniteLoading from "svelte-infinite-loading";
  import type { StateChanger } from "svelte-infinite-loading";
  import type { PageData } from "./$types";

  export let data: PageData;

  let hasMore = true;
  let perPage = 50;
  let page = -1;
  let messages:
    | {
        id: string;
        profile_id: string;
        repository_id: string;
        content: string;
        created_at: string;
        updated_at: string;
        flags: number;
      }[] = [];

  const loadMoreMessages = async ({
    detail: { loaded, complete },
  }: {
    detail: StateChanger;
  }) => {
    console.log("loading....");

    page++;

    const limits = getPagination(page, perPage)
    console.log(limits);
    let newMessages = await supabaseClient
      .from("messages")
      .select("*")
      .eq("repository_id", data.repo?.id ?? "-")
      .order("created_at", { ascending: false })
      .range(limits.from, limits.to);

    if ((newMessages.data?.length ?? perPage) < perPage) {
      complete();
      console.log("exceed");
      console.log(messages);
      hasMore = false;
      return;
    }

    messages = [...((newMessages.data ?? []).reverse()), ...messages];
    loaded();
  };

  const sendMessage = async (content: string) => {
    let res = await supabaseClient.from("messages").insert({
        content: content,
        repository_id: data.repo?.id ?? "-",
        profile_id: data.session?.user.id ?? "-",
      }).select("*").single();

    console.log(res);

    if (res.data) {
        messages = [res.data, ...messages];
    }
  };

  export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : perPage;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;

    return { from, to };
  };
</script>

<h1>{data.repo.owner}/{data.repo.name}'s Chat</h1>
<div>
  {#each messages as message}
    <p>{message.content}, {message.created_at}</p>
  {/each}

  <InfiniteLoading
    on:infinite={loadMoreMessages}
    distance={perPage}
    direction={"top"}
  />
</div>
<button on:click={() => sendMessage("Another message?!")}>Send new Message</button>
