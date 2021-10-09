import { Octokit } from "@octokit/rest";
import type { GetServerSidePropsContext } from "next";
import { createChat, getChatByRepoOwnerAndName, getChats, updateChat } from "service/supabase";

export default function CreateOrRedirectToChat() {
  return null;
}

/**
 * This "page" only serves to redirect users to /chats/:id, if chat exists.
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
export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ repoOwner: string; repoName: string }>
): Promise<{
  redirect: {
    destination: string;
    permanent: boolean;
  };
}> => {
  const { repoOwner, repoName } = context.params || {};
  if (!repoOwner || !repoName)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data: chatFoundByName } = await getChatByRepoOwnerAndName(repoOwner, repoName, { selectFields: ["id"] });

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

  const repoData = await octokit.rest.repos
    .get({
      owner: repoOwner.trim(),
      repo: repoName.trim(),
    })
    .then(({ data }) => data)
    .catch(() => undefined);

  // Repository does not exist in Github
  if (!repoData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data: existingChats } = await getChats({
    selectFields: ["id"],
    matchParams: { github_repo_id: repoData.id.toString() },
  });

  if (existingChats && existingChats.length > 0 && repoData.owner.login && repoData.name) {
    //Repo exists by id, Name of repo must have changed, update it
    console.log("repo exists by uid");

    const { data: updatedChat } = await updateChat(
      { repo_name: repoData.name, repo_owner: repoData.owner.login },
      { matchParams: { github_repo_id: repoData.id.toString() } }
    );

    chatId = updatedChat?.[0]?.id;
  } else {
    //If repo doesn't exists in our db, create it
    const { data: chat } = await createChat({
      github_repo_id: repoData.id.toString(),
      repo_owner: repoData.full_name.split("/")[0],
      repo_name: repoData.name,
      repo_description: repoData.description,
    });

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

  //If we don't have a chat id, something went wrong, redirect to home
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
