import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  ButtonDanger,
  ButtonPrimary,
  Avatar,
  TextInput,
  Dropdown,
  Flash,
  Spinner,
} from "@primer/components";
import { supabase } from "../_app";
import Header from "../../components/header";
import { SetStateAction, useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import { useMutation } from "react-query";
import { Chat } from "../../types";

const NewChat: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const {
    mutate: createChat,
    isLoading,
    error: createChatError,
  } = useMutation(async () => {
    const octokit = new Octokit({
      auth: session?.provider_token!,
    });

    const repoData = await octokit.rest.repos.get({
      owner: owner,
      repo: repo,
    });

    if (!repoData.data.permissions?.admin) {
      throw new Error(
        "You should have admin rights in the repository to be able to create a chat"
      );
    }

    const { data: existingChats, error: existingChatError } = await supabase
      .from<Chat>("chats")
      .select()
      .eq("github_repo_id", repoData.data.id.toString());

    console.log(existingChatError);

    if (existingChatError) {
      throw new Error(
        "There's been an error accessing database. Please, try again."
      );
    }

    if (existingChats && existingChats.length > 0) {
      throw new Error("There is already a chat for this repository");
    }

    // These two inserts would ideally be wrapped in a transaction

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([
        {
          github_repo_id: repoData.data.id,
          owner_id: session?.user?.id,
          repo_owner: repoData.data.full_name.split("/")[0],
          repo_name: repoData.data.name,
          repo_description: repoData.data.description,
        },
      ]);

    if (chatError || chat == null) {
      throw new Error(
        "Failed to insert new chat in database. Please, try again." +
          "If the error persists, please notify the creators of Github Chat."
      );
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .insert([{ chat_id: chat[0].id, user_id: session?.user?.id }]);

    if (memberError || memberData == null) {
      throw new Error(
        "Failed to insert new member in database. Please, try again." +
          "If the error persists, please notify the creators of Github Chat."
      );
    }

    router.push(`/chats/${chat[0].id}`);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/chat/new`);
        return;
      }
    }
  }, [isAuthenticated, router]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header showAvatar={true} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Box
          bg="bg.secondary"
          padding={6}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="100%"
          maxWidth="520px"
        >
          <Text as="h3" margin={0}>
            Create a new Chat!
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            marginTop={4}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
            >
              <Box mb={2}>
                <Text>Owner</Text>
              </Box>
              <TextInput
                aria-label="Owner"
                name="owner"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setOwner(e.target.value)
                }
              />
            </Box>
            <Box marginX={4}>
              <Text fontWeight="bold" fontSize={3}>
                /
              </Text>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
            >
              <Box mb={2}>
                <Text>Repository</Text>
              </Box>
              <TextInput
                aria-label="Repo"
                name="repo"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setRepo(e.target.value)
                }
              />
            </Box>
          </Box>
          {createChatError && (
            <Flash marginTop={3} sx={{ width: "100%" }} variant="danger">
              {(createChatError as Error).message}
            </Flash>
          )}
          <ButtonPrimary
            marginTop={4}
            disabled={isLoading}
            onClick={() => createChat()}
            variant="large"
            minWidth={164}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <>
                <Spinner size="small" sx={{ marginRight: 2 }} />
                Creating
              </>
            ) : (
              <>Create Chat</>
            )}
          </ButtonPrimary>
        </Box>
      </Box>
    </Box>
  );
};

export default NewChat;
