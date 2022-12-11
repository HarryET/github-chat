<script lang="ts">
  import { supabaseClient } from "$lib/db";

  const login = () => {
    supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };
</script>

<button on:click={login}>login</button>
