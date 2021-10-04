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
import {
  PlusIcon,
  StopIcon,
  SyncIcon,
  CommentDiscussionIcon,
} from "@primer/octicons-react";
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
  const userMeta = session?.user?.user_metadata;

  const isAuthenticated = session !== null;
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/chats/${id}`);
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
      if (userMeta !== null) {
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
  } = useQuery<MessageType[]>(
    "messages",
    async () => {
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
        nickname,
        user: user_id (
          username,
          avatar_url  
        )        
      )
    `
        )
        .eq("chat_id", id);

      if (error) {
        throw error;
      }

      return data || [];
    },
    { enabled: !!id && isAuthenticated }
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
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
          {(isMessagesLoading ||
            !!messagesError ||
            (messages && messages.length === 0)) && (
            <Box
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                maxWidth={400}
              >
                {/* Loading */}
                {isMessagesLoading && !messages && (
                  <>
                    <Spinner margin={2} size="medium" />
                    <Text>Loading messages...</Text>
                  </>
                )}
                {/* Error fetching messages */}
                {!!messagesError && !isMessagesLoading && (
                  <>
                    <StopIcon size="medium" />
                    <Text mt={2} textAlign="center">
                      Something went wrong trying to load messages.
                    </Text>
                    <Button mt={3} onClick={() => refetchMessages()}>
                      <SyncIcon size="small" />
                      <Text ml={2}>Retry</Text>
                    </Button>
                  </>
                )}
                {/* There are no messages yet */}
                {messages && messages.length === 0 && (
                  <>
                    <CommentDiscussionIcon size="medium" />
                    <Text mt={2} textAlign="center">
                      {"There are no messages yet."} <br />
                      {"Be the first one to write something!"}
                    </Text>
                  </>
                )}
              </Box>
            </Box>
          )}
          {messages &&
            messages.map((message) => (
              <Message
                key={message.id}
                avatar={message.author.user.avatar_url}
                username={
                  message.author.nickname || message.author.user.username
                }
                content={message.content}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewChat;
