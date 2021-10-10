import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button, Link, ButtonPrimary } from "@primer/components";
import { StopIcon, SyncIcon, CommentDiscussionIcon } from "@primer/octicons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MessageType } from "types";
import { SideMenu } from "components/SideMenu";
import { Root } from "components/Root";
import { MessageInput } from "components/MessageInput";
import { MessageList } from "components/MessageList";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { supabase } from "service/supabase";
import NextLink from "next/link";
import { LoginButton } from "components/LoginButton";
import { User } from "@supabase/gotrue-js";

const messageQuery = `
  id,
  chat_id,
  content,
  created_at,
  edited_at,
  user: user_id(
    id,
    username,
    avatar_url    
  )
`;

const ViewChat: NextPage = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const chatId = typeof router.query.chatId === "string" ? router.query.chatId : undefined;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  })

  const [isLoginLoading, setLoginLoading] = useState(false);

  // TODO Handle error
  const { mutate: handleSignIn } = useMutation(
    async (redirectPath: string) => {
      setLoginLoading(true);
      const { error } = await supabase.auth.signIn(
        { provider: "github" },
        {
          redirectTo: `${window.location.origin}${redirectPath}`,
          scopes: "read:org,read:user,user:email",
        }
      );

      if (error) {
        console.error(error);
        throw error;
      }
    },
    {
      onError: () => {
        setLoginLoading(false);
      },
    }
  );

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery(
    ["messages", chatId],
    async () => {
      const { data, error } = await supabase.from<MessageType>("messages").select(messageQuery).eq("chat_id", chatId);

      if (error) {
        throw error;
      }

      return data || [];
    },
    { enabled: !!chatId, staleTime: Infinity }
  );

  useEffect(() => {
    supabase
      .from<{ id: string; chat_id: string }>("messages")
      .on("*", async (payload) => {
        const { new: messageRow } = payload;
        if (messageRow.chat_id === chatId) {
          // Fetch full message and insert it to messages collection
          const { data: message, error } = await supabase
            .from<MessageType>("messages")
            .select(messageQuery)
            .eq("id", messageRow.id)
            .single();

          if (error || !message) {
            // TODO
            return;
          }

          queryClient.setQueryData<MessageType[]>(
            ["messages", chatId],
            // Sort messages and remove duplicates in case we got an event twice
            (previousMessages) =>
              R.uniqBy(
                (message) => message.id,
                [...(previousMessages || []), message].sort((a, b) => a.created_at.localeCompare(b.created_at))
              )
          );
        }
      })
      .subscribe();
  }, [chatId, queryClient]);

  return (
    <Root>
      <Box bg="canvas.default" display="flex" flexDirection="row" flexGrow={1} width="100%" overflowY="hidden">
        <SideMenu selectedChatId={chatId} />
        <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
          {(isMessagesLoading || !!messagesError || (messages && messages.length === 0)) && (
            <Box
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400}>
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
          {!!chatId && user && <MessageInput chatId={chatId} user={user} />}
          {!!chatId && !user && (
            <Box px={3} py={3} width="100%">
              <Box
                paddingX={3}
                paddingY={3}
                borderRadius={8}
                bg={"canvas.overlay"}
                display="flex"
                flexDirection={["column", "row"]}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={2} fontWeight={400} color="fg.default">
                  Want to participate?
                </Text>
                <LoginButton
                  isLoading={isLoginLoading}
                  onClick={() => handleSignIn(`/chats/${chatId}`)}
                  ml={[0, 3]}
                  mt={[3, 0]}
                  minWidth={["100%", 0]}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Root>
  );
};

export default ViewChat;
