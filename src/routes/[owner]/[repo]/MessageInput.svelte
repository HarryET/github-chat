<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let messageContent: string;

  const sendMessage = () => {
    dispatch("new_message", {
      content: messageContent,
    });
   messageContent = "";
  };
</script>

<div class="flex flex-col w-full space-y-2">
  <textarea class="w-full" bind:value={messageContent} />
  <div class="flex flex-row w-full content-center justify-between">
    <div />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>
