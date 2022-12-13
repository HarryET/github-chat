<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.user.nickname ?? data.user.username} | GithubChat</title>
</svelte:head>

<h1>{data.user.nickname}'s Profile!</h1>
