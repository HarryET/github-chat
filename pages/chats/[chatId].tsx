import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button } from "@primer/components";
import {
  StopIcon,
  SyncIcon,
  CommentDiscussionIcon,
} from "@primer/octicons-react";
import { supabase } from "../_app";
import Message from "../../components/Message";
import { useQuery } from "react-query";
import { MessageType } from "../../types";
import { SideMenu } from "../../components/SideMenu";
import { Root } from "../../components/Root";

const ViewChat: NextPage = () => {
  const router = useRouter();
  const chatId =
    typeof router.query.chatId === "string" ? router.query.chatId : undefined;

  const session = supabase.auth.session();

  const isAuthenticated = session !== null;
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/chats/${chatId}`);
  }

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
        .eq("chat_id", chatId);

      if (error) {
        throw error;
      }

      return data || [];
    },
    { enabled: !!chatId && isAuthenticated }
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Root>
      <Box
        bg="canvas.default"
        display="flex"
        flexDirection="row"
        flexGrow={1}
        width="100%"
      >
        <SideMenu selectedChatId={chatId} />
        <Box flexGrow={1} height="100%" padding={3}>
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
    </Root>
  );
};

export default ViewChat;
