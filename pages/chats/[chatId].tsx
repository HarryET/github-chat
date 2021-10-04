import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button } from "@primer/components";
import {
  StopIcon,
  SyncIcon,
  CommentDiscussionIcon,
} from "@primer/octicons-react";
import { supabase } from "../_app";
import { useQuery, useQueryClient } from "react-query";
import { Member, MessageType } from "../../types";
import { SideMenu } from "../../components/SideMenu";
import { Root } from "../../components/Root";
import { MessageInput } from "../../components/MessageInput";
import { MessageList } from "../../components/MessageList";
import { useEffect } from "react";

const ViewChat: NextPage = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const chatId =
    typeof router.query.chatId === "string" ? router.query.chatId : undefined;

  const user = supabase.auth.user();

  const isAuthenticated = user !== null;
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/chats/${chatId}`);
  }

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery<MessageType[]>(
    ["messages"],
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
        id,
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
    { enabled: !!chatId && isAuthenticated, staleTime: Infinity }
  );

  // TODO Fetch all members of this channel - subscribe also

  useEffect(() => {
    supabase
      .from("messages")
      .on("*", (payload) => {
        console.log("UPDATED");
        queryClient.setQueryData<MessageType[] | undefined>(
          ["messages"],
          (previousMessages) => {
            const { id, chat_id, content, member_id, created_at } = payload.new;
            return previousMessages !== undefined
              ? [
                  ...previousMessages,
                  {
                    id,
                    author: {
                      id: "",
                      nickname: "Foo",
                      user: {
                        username: "Foo",
                        avatar_url: "",
                      },
                    },
                    content,
                    created_at,
                  },
                ]
              : undefined;
          }
        );
      })
      .subscribe();
  }, [queryClient]);

  const {
    data: member,
    error: memberError,
    isLoading: isMemberLoading,
  } = useQuery(
    "member",
    async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, nickname")
        .eq("chat_id", chatId)
        .eq("user_id", user?.id)
        .single();
      if (error) {
        throw error;
      }
      return data as Member;
    },
    { enabled: !!chatId && isAuthenticated }
  );

  if (!isAuthenticated) {
    return null;
  }

  console.log("MESSAGES", messages);

  return (
    <Root>
      <Box
        bg="canvas.default"
        display="flex"
        flexDirection="row"
        flexGrow={1}
        width="100%"
        overflowY="hidden"
      >
        <SideMenu selectedChatId={chatId} />
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          height="100%"
          border="1px dashed red"
        >
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
              // border="2px dashed pink"
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
          {messages && <MessageList messages={messages} />}
          {!!chatId && member && (
            <MessageInput chatId={chatId} memberId={member.id} />
          )}
        </Box>
      </Box>
    </Root>
  );
};

export default ViewChat;
