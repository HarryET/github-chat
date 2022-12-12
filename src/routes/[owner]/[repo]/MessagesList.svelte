<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import InfiniteLoading from "svelte-infinite-loading";
  import type { StateChanger } from "svelte-infinite-loading";
  import { MessageQuery, type Message } from "./types";
  import MessageComponent from "./Message.svelte";

  export let repository_id: string;

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
      .select(MessageQuery)
      .eq("repository_id", repository_id)
      .order("created_at", { ascending: false })
      .range(limits.from, limits.to);

    console.log("[loadMoreMessages] finished fetching");

    if ((newMessages.data?.length ?? perPage) < perPage) {
      complete();
      console.log(`[loadMoreMessages] exceeded messages, no more loading.`);
      hasMore = false;
    }

    console.log(
      `[loadMoreMessages] finished loading, found ${
        (newMessages.data ?? []).length
      } more messages`
    );
    // @ts-ignore
    messages = [...(newMessages.data ?? []).reverse(), ...messages];
    loaded();
  };

  export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : perPage;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;

    return { from, to };
  };
</script>

<div class="space-y-2 w-full h-full">
  {#each messages as message}
    <MessageComponent {message} />
  {/each}

  <InfiniteLoading
    on:infinite={loadMoreMessages}
    distance={perPage}
    direction={"top"}
  >
    <div slot="noResults" class="hidden" />
    <div slot="noMore" class="hidden" />
    <div slot="error" class="hidden" />
    <div slot="spinner" class="hidden" />
  </InfiniteLoading>
</div>
