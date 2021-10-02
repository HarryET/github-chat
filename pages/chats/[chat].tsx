import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  ButtonPrimary,
  BranchName,
  SideNav,
  Spinner,
  Button,
} from "@primer/components";
import { PlusIcon, StopIcon, SyncIcon } from "@primer/octicons-react";
import { supabase } from "../_app";
import Header from "../../components/header";
import Message from "../../components/message";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MessageType } from "../../types";

const ViewChat: NextPage = () => {
  const router = useRouter();
  const { chat: id } = router.query;

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  if (typeof window !== "undefined") {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/`);
    }
  }

  /**
   * TODO Probably would be a good idea the side list of chats to a separate component,
   * which picks the chat id from the url and takes care itself of fetching and rendering the data.
   *
   * This component can be then used in both index.tsx and [chat].tsx.
   *
   * The list of chats data fetching using react-query is already defined in index.tsx.
   * Pending to add a UI for errors.
   */
  const [chats, setChats] = useState(
    [] as {
      id: string;
      github_repo_id: string;
      // created_at: Date;
      // owner_id: string;
      repo_owner: string;
      repo_name: string;
      // repo_description: string;
      // repo_data_last_update: Date;
    }[]
  );

  useEffect(() => {
    (async () => {
      if (userMeta != null) {
        const { data, error } = await supabase
          .from("members")
          .select(
            `
            id,
            chat_id (
              id,
              github_repo_id,
              repo_owner,
              repo_name
            )
          `
          )
          .eq("user_id", session?.user?.id);

        if (data == null) {
          // TODO handle no data!
          return;
        }

        if (error) {
          // TODO handle error!
          return;
        }

        setChats(data.map((member) => member.chat_id));
      } else {
        // TODO handle no auth!
      }
    })();
  }, [session?.user?.id, userMeta]);

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery<MessageType[]>("messages", async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
      id,
      chat_id,
      content,
      created_at,
      edited_at,
      author: member_id(
        id,
        nickname
      )
    `
      )
      .eq("chat_id", id);

    /**
     * TODO
     * I think users table is not readable from the client app.
     * In order to fetch the Github user info and join it to each message, we probably need to create
     * a row in a new table "profiles" whenever a new user signs in, and copy there the raw user meta data.
     *
     * This article explains exactly this case:
     * https://dev.to/sruhleder/creating-user-profiles-on-sign-up-in-supabase-5037
     */
    // author: user_id(
    //   raw_user_meta_data
    // )

    if (error) {
      throw error;
    }

    return data || [];
  });

  return (
    <Box
      border="1px dashed pink"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Header showAvatar={true} />
      <Box
        bg="bg.primary"
        display="flex"
        flexDirection="row"
        alignItems="start"
        justifyContent="center"
        flexGrow={1}
      >
        <Box width="25%" height="100%" padding={4}>
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={3}
            style={{
              maxWidth: "360px",
            }}
          >
            <Text fontWeight="bold">Your Chats:</Text>
            <ButtonPrimary
              variant="small"
              onClick={() => router.push("/chats/new")}
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <PlusIcon size={18} />
                <Box paddingLeft={2}>
                  <Text>New</Text>
                </Box>
              </Box>
            </ButtonPrimary>
          </Box>
          <SideNav bordered maxWidth={360} aria-label="Main">
            {chats.length > 0 &&
              chats.map((chat) => {
                return (
                  <SideNav.Link
                    key={chat.id}
                    href={`/chats/${chat.id}`}
                    selected={id == chat.id}
                  >
                    <Text>
                      {chat.repo_owner}/{chat.repo_name}
                    </Text>
                  </SideNav.Link>
                );
              })}
          </SideNav>
        </Box>
        <Box width="75%" height="100%" padding={3}>
          {(isMessagesLoading || !!messagesError) && (
            <Box
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {isMessagesLoading && !messages && (
                <>
                  <Spinner margin={2} size="medium" />
                  <Text>Loading messages...</Text>
                </>
              )}
              {!!messagesError && !isMessagesLoading && (
                <>
                  <StopIcon size="medium" />
                  <Text mt={2}>
                    Something went wrong trying to load messages.
                  </Text>
                  <Button mt={3} onClick={() => refetchMessages()}>
                    <SyncIcon size="small" />
                    <Text ml={2}>Retry</Text>
                  </Button>
                </>
              )}
            </Box>
          )}
          {messages &&
            messages.map((message) => (
              <Message
                key={message.id}
                avatar="https://github.com/octocat.png"
                username={message.author.nickname || ""}
                content={message.content}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewChat;
