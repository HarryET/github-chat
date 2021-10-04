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
  StyledOcticon,
} from "@primer/components";
import { supabase } from "../_app";
import Header from "../../components/header";
import { SetStateAction, useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import { useMutation } from "react-query";
import { Chat } from "../../types";
import { useForm } from "react-hook-form";
import { XIcon } from "@primer/octicons-react";
import { MainActionBox } from "../../components/MainActionBox";

type FormValues = {
  owner: string;
  repo: string;
};

const NewChat: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/chats/new`);
  }

  const {
    mutate: createChat,
    isLoading,
    error: createChatError,
  } = useMutation(async ({ owner, repo }: FormValues) => {
    const octokit = new Octokit({
      auth: session?.provider_token!,
    });

    const repoData = await octokit.rest.repos.get({
      owner: owner.trim(),
      repo: repo.trim(),
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
      if (chatError) {
        console.error(chatError);
      }
      throw new Error(
        "Failed to insert new chat in database. Please, try again." +
          " If the error persists, please notify the creators of Github Chat."
      );
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .insert([{ chat_id: chat[0].id, user_id: session?.user?.id }]);

    if (memberError || memberData == null) {
      if (memberError) {
        console.error(memberError);
      }
      throw new Error(
        "Failed to insert new member in database. Please, try again." +
          "If the error persists, please notify the creators of Github Chat."
      );
    }

    router.push(`/chats/${chat[0].id}`);
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (values: FormValues) => createChat(values);

  if (!isAuthenticated) {
    return null;
  }

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <MainActionBox maxWidth={520}>
            <Text as="h1" margin={0}>
              Create a new Chat
            </Text>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              marginTop={4}
            >
              <Box display="flex" flexDirection="column" flexGrow={1}>
                <Box mb={2}>
                  <Text>Owner</Text>
                </Box>
                <TextInput
                  aria-label="Owner"
                  {...register("owner", { required: true })}
                  sx={{
                    // TODO Use colors from GH Primer system
                    ...(errors.owner && { borderColor: "red" }),
                  }}
                />
                {errors.owner?.message && (
                  <Text fontSize={0} marginTop={2}>
                    {errors.owner.message}
                  </Text>
                )}
              </Box>
              <Box marginX={4} display="flex" flexDirection="column">
                <Text marginBottom={2} sx={{ visibility: "hidden" }}>
                  A
                </Text>
                <Text fontWeight="bold" fontSize={3}>
                  /
                </Text>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="start"
                flexGrow={1}
              >
                <Box mb={2}>
                  <Text>Repository</Text>
                </Box>
                <TextInput
                  aria-label="Repo"
                  {...register("repo", { required: true })}
                  sx={{
                    ...(errors.repo && { borderColor: "red" }),
                  }}
                />
                {errors.repo?.message && (
                  <Text fontSize={0} marginTop={2}>
                    {errors.repo.message}
                  </Text>
                )}
              </Box>
            </Box>
            {createChatError && (
              <Flash marginTop={3} sx={{ width: "100%" }} variant="danger">
                <StyledOcticon icon={XIcon} />
                <Text fontSize={1}>
                  {(createChatError as Error)?.message ||
                    "Failed to create chat"}
                </Text>
              </Flash>
            )}
            <ButtonPrimary
              marginTop={4}
              disabled={isLoading}
              variant="large"
              width="100%"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              type="submit"
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
          </MainActionBox>
        </form>
      </Box>
    </Box>
  );
};

export default NewChat;
