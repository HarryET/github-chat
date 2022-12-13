<script lang="ts">
    import { supabaseClient } from "$lib/db";
    import { onMount } from "svelte";
    import { MembershipQuery, type Membership, type UserProfile } from "./types";

    export let profile: UserProfile | undefined;

    let sidebarEntries: Membership[] = []
    onMount(async () => {
        const entries = await supabaseClient.from("repository_memberships").select(MembershipQuery)
        if (entries.data) {
            sidebarEntries = entries.data as Membership[]
        }
    })
</script>

<div class="h-full w-full min-w-[240px]">
    <div class="p-4 h-full w-full bg-gray-50 flex flex-col items-start justify-between">
        <div class="flex flex-col items-start content-start space-y-8">
            <div class="flex flex-row items-center content-start space-x-2">
                <!-- Branding -->
                <img src="/img/icon-brand.svg" alt="Github Chat's Icon" class="h-[28px] w-auto" />
                <div class="flex flex-row items-baseline">
                    <h1 class="font-hubot text-gray-900 font-semibold text-xl">Github Chat</h1>
                    <p class="font-hubot text-gray-500 font-thin text-sm">v2</p>
                </div>
            </div>
            <div>
                {#each sidebarEntries as entry}
                    <a href={`/${entry.repository.owner}/${entry.repository.name}`}>
                        <div class="flex flex-row space-x-2">
                            <img class="h-6 w-auto rounded-sm" src={`https://github.com/${entry.repository.owner}.png`} alt={`${entry.repository.owner}'s avatar`} />
                            <div class="flex flex-row items-baseline content-center hover:underline">
                                <span class="text-gray-500 text-xs hover:text-gray-600">
                                    {entry.repository.owner}/
                                </span>
                                <p class="text-gray-800 hover:text-gray-900">
                                    {entry.repository.name}
                                </p>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
        <div class="w-full">
            {#if profile}
                <div class="flex flex-row border-t pt-2 w-full items-center space-x-2">
                    <img class="h-12 w-auto rounded-md" src={profile.avatar_url} alt={`${profile.username}'s avatar`} />
                    <div class="flex flex-col">
                        <h2 class="text-gray-900">{profile.nickname ?? profile.username}</h2>
                        <p class="text-xs text-gray-500">@{profile.username}</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
