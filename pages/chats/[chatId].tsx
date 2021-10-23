import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button } from "@primer/components";
import { StopIcon, SyncIcon, CommentDiscussionIcon } from "@primer/octicons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RealtimeMessage, MessageType } from "types";
import { SideMenu } from "components/SideMenu";
import { Root } from "components/Root";
import { MessageInput } from "components/MessageInput";
import { MessageList } from "components/MessageList";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { supabase } from "service/supabase";

import { LoginButton } from "components/LoginButton";
import { AuthChangeEvent } from "@supabase/gotrue-js";
import { saveRecentChat } from "service/localStorage";

const messageQuery = `
  id,
  type,
  chat_id,
  content,
  files,
  created_at,
  edited_at,
  user: users!user_id(
    id,
    username,
    avatar_url,
    display_name,
    flags,
    bot
  )
`;

const ViewChat: NextPage = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const chatId = typeof router.query.chatId === "string" ? router.query.chatId : undefined;

  const [authState, setAuthState] = useState<AuthChangeEvent>();

  // TODO get chat name and owner and set title.
  const [title, setTitle] = useState("GitHub Chat | A chat room for every GitHub repository");

  const user = supabase.auth.user();
  supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
    setAuthState(event);
  });

  const [updatedMembersAt, setUpdatedMembersAt] = useState<string>();

  useEffect(() => {
    if (chatId && user) {
      supabase
        .from("members")
        .upsert({
          user_id: user.id,
          chat_id: chatId,
        })
        .then(() => {
          setUpdatedMembersAt(new Date().toISOString());
        });
    }
  }, [chatId, user]);

  const { data: chat } = useQuery(
    ["chats", chatId],
    async () => {
      type Chat = { id: string; repo_owner: string; repo_name: string; repo_owner_avatar?: string };
      if (chatId) {
        const { data: chat } = await supabase.from<Chat>("chats").select().eq("id", chatId).single();
        if (chat) {
          saveRecentChat({
            id: chatId,
            repoOwner: chat.repo_owner,
            repoName: chat.repo_name,
            repoOwnerAvatar: chat.repo_owner_avatar,
          });
          setTitle(`GitHub Chat | ${chat.repo_owner}/${chat.repo_name}`);
          return chat;
        }
      }
    },
    { enabled: !!chatId }
  );

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
      const { data, error } = await supabase
        .from<MessageType>("messages")
        .select(messageQuery)
        .eq("chat_id", chatId)
        .order("created_at");

      if (error) {
        throw error;
      }

      return data || [];
    },
    { enabled: !!chatId, staleTime: Infinity }
  );

  useEffect(() => {
    supabase
      // TODO change to realtime_messages
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

          // TODO Get RealTime Views Working!
          // const message: MessageType = {
          //   id: messageRow.id,
          //   chat_id: messageRow.chat_id,
          //   content: messageRow.content,
          //   created_at: messageRow.created_at,
          //   user: {
          //     id: messageRow.author_id,
          //     username: messageRow.author_username,
          //     avatar_url: messageRow.author_avatar_url,
          //     flags: messageRow.author_flags
          //   },
          //   type: messageRow.type,
          //   files: messageRow.files ?? []
          // };

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
    <Root fixedScreenHeight={true}>
      <Head>
        <title>{title}</title>
      </Head>
      <Box bg="canvas.default" display="flex" flexDirection="row" flexGrow={1} width="100%" maxWidth="100%">
        {user && !!updatedMembersAt && (
          <SideMenu router={router} selectedChatId={chatId} display={["none", "none", "flex"]} />
        )}
        <Box display="flex" flexDirection="column" flexGrow={1}>
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
            <Box px={[2, 2, 3]} pb={3} width="100%">
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
