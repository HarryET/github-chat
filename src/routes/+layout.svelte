<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
  import "highlight.js/styles/github.css"
  import "../app.css";

  const queryClient = new QueryClient()

  onMount(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
