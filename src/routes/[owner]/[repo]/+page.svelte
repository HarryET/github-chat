<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import InfiniteLoading from "svelte-infinite-loading";
  import type { StateChanger } from "svelte-infinite-loading";
  import type { PageData } from "./$types";
  import type { Message } from "./types";
  import MessageComponent from "./Message.svelte"

  export let data: PageData;

  let messageQuery = `
  id,
  content,
  created_at,
  updated_at,
  user: profiles!profile_id(
    id,
    username,
    avatar_url,
    nickname,
    flags
  ),
  flags`;

  let hasMore = true;
  let perPage = 50;
  let page = -1;
  let messages: Message[] = [];

  const loadMoreMessages = async ({
    detail: { loaded, complete },
  }: {
    detail: StateChanger;
  }) => {
    console.log("[loadMoreMessages] loading began");

    page++;

    const limits = getPagination(page, perPage);
    let newMessages = await supabaseClient
      .from("messages")
      .select(messageQuery)
      .eq("repository_id", data.repo?.id ?? "-")
      .order("created_at", { ascending: false })
      .range(limits.from, limits.to);

    console.log("[loadMoreMessages] finished fetching");

    if ((newMessages.data?.length ?? perPage) < perPage) {
      complete();
      console.log(`[loadMoreMessages] exceeded messages, no more loading.`);
      hasMore = false;
    }

    console.log(`[loadMoreMessages] finished loading, found ${(newMessages.data ?? []).length} more messages`);
    // @ts-ignore
    messages = [...(newMessages.data ?? []).reverse(), ...messages];
    loaded();
  };

  const sendMessage = async (content: string) => {
    let res = await supabaseClient
      .from("messages")
      .insert({
        content: content,
        repository_id: data.repo?.id ?? "-",
        profile_id: data.session?.user.id ?? "-",
      })
      .select(messageQuery)
      .single();

    console.log(res);

    if (res.data) {
      // @ts-ignore
      messages = [res.data, ...messages];
    }
  };

  export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : perPage;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;

    return { from, to };
  };

  /*
	noResults: {};
noMore: {};
error: { attemptLoad: () => void };
spinner: { isFirstLoad: boolean };*/
</script>

<h1>{data.repo.owner}/{data.repo.name}'s Chat</h1>
<div class="space-y-2 max-w-2xl">
  {#each messages as message}
    <MessageComponent message={message} />
  {/each}

  <InfiniteLoading
    on:infinite={loadMoreMessages}
    distance={perPage}
    direction={"top"}
  >
    <div slot="noResults" class="hidden"></div>
    <div slot="noMore" class="hidden"></div>
    <div slot="error" class="hidden"></div>
    <div slot="spinner" class="hidden"></div>
  </InfiniteLoading>
</div>
<button on:click={() => sendMessage("Hello, I'm a message, like my **styles**?")}
  >Send new Message</button
>
