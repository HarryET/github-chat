<script lang="ts">
  import { supabaseClient } from "$lib/db";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { ArrowRight } from "@steeze-ui/heroicons";
  import type { PageData } from "./$types";

  export let data: PageData;

  const login = () => {
    supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };
</script>

<div class="w-full h-full flex flex-col items-center justify-between px-6 py-6">
  <div class="scale-125 flex flex-row items-center content-start space-x-2">
    <!-- Branding -->
    <img
      src="/img/icon-brand.svg"
      alt="Github Chat's Icon"
      class="h-[28px] w-auto"
    />
    <div class="flex flex-row items-baseline">
      <h1 class="font-hubot text-gray-900 font-semibold text-xl">
        Github Chat
      </h1>
      <p class="font-hubot text-gray-500 font-thin text-sm">v2</p>
    </div>
  </div>
  <div class="flex-grow">
    <div class="flex flex-col items-center justify-center w-full h-full">
      <div class="flex flex-col items-start justify-center space-y-4">
        <div class="flex flex-col items-start justify-center">
          <h1 class="text-3xl text-gray-900">A chat room for every<br/>GitHub repository.</h1>
          <h2 class="text-2xl text-gray-800">Real-time.</h2>
        </div>
        {#if !data.session}
        <button class="bg-brand-600 hover:bg-brand-700 w-full py-2 px-4 mt-2 text-gray-100 rounded-md" on:click={login}>
          <div class="flex flex-row items-center justify-center space-x-2">
            <p>Sign in with GitHub</p>
            <Icon src={ArrowRight} class="h-5 w-auto" />
          </div>
        </button>
        {:else}
        <a href="/home" class="bg-brand-600 hover:bg-brand-700 w-full py-2 px-4 mt-2 text-gray-100 rounded-md">
          <div class="flex flex-row items-center justify-center space-x-2">
            <p>Continue chatting</p>
            <Icon src={ArrowRight} class="h-5 w-auto" />
          </div>
        </a>
        {/if}

      </div>
    </div>
  </div>
  <div class="text-gray-500">
    A project by <a class="text-brand-600 hover:text-brand-700 hover:underline" href="https://github-chat.com/users/HarryET">Harry</a>, <a class="text-brand-600 hover:text-brand-700 hover:underline" href="https://twitter.com/_hugocardenas">Hugo</a> and <a class="text-brand-600 hover:text-brand-700 hover:underline" href="https://twitter.com/PeraltaDev">Victor</a>
  </div>
</div>
