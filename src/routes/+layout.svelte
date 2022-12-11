<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import "highlight.js/styles/github.css"
  import "../app.css";

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

<slot />
