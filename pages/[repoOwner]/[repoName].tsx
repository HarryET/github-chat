import { Octokit } from "@octokit/rest";
import { Root } from "components/Root";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { getChatByOwnerAndName, supabase } from "service/supabase";
import { Chat } from "types";

export default function CreateOrRedirectToChat() {
  return null;
}

/**
 * This page only serves to redirect users to /chats/:id, if chat exists.
 * Otherwise, chat will be created and user will be redirected to chat if succesful.
 *
 * Possible scenarios:
 * 1. Chat exists -> User gets redirected
 * 2. Chat in url not found by name, found via github api, and we have a match in our database already.
 *      This means repo name changed, so update repo name on our table, and proceed to redirection.
 * 3. Chat not found in our table by name or id, means chat has not been created. Attempt chat creation,
 *      and if successful, redirect user to newly created chat.
 *
 */
export const getServerSideProps: GetServerSideProps<{}, { repoOwner: string; repoName: string }> = async (context) => {
  const { repoOwner, repoName } = context.params || {};
  if (!repoOwner || !repoName)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data: chatFoundByName } = await getChatByOwnerAndName(repoOwner, repoName, { selectFields: "id" });

  let chatId = chatFoundByName?.[0]?.id;

  if (chatId) {
    return {
      redirect: {
        destination: `/chats/${chatId}`,
        permanent: false,
      },
    };
  }

  // Chat not found by name, check if repo exists in github
  const octokit = new Octokit({});

  const { data: repoData } = await octokit.rest.repos.get({
    owner: repoOwner.trim(),
    repo: repoName.trim(),
  });

  const { data: existingChats, error: existingChatError } = await supabase
    .from<Chat>("chats")
    .select("id")
    .eq("github_repo_id", repoData.id.toString());

  if (existingChats && existingChats.length > 0 && repoData.owner.login && repoData.name) {
    //Repo exists by id, Name of repo must have changed, update it
    console.log("repo exists by uid");

    const { data: updatedChat } = await supabase
      .from<Chat>("chats")
      .update({ repo_name: repoData.name, repo_owner: repoData.owner.login })
      .eq("github_repo_id", repoData.id.toString());

    chatId = updatedChat?.[0]?.id;
  } else {
    //If repo doesn't exists in our db, create it
    const { data: chat, error: chatError } = await supabase.from<Chat>("chats").insert([
      {
        github_repo_id: repoData.id.toString(),
        repo_owner: repoData.full_name.split("/")[0],
        repo_name: repoData.name,
        repo_description: repoData.description,
      },
    ]);
    console.log("we created it,", chat, chatError);

    chatId = chat?.[0]?.id;
  }

  if (chatId) {
    //If all went well, we have a chatId
    return {
      redirect: {
        destination: `/chats/${chatId}`,
        permanent: false,
      },
    };
  }
  console.log("no chatid", repoData.name);

  //If we don't have a chat id, something went wrong, redirect to home
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
