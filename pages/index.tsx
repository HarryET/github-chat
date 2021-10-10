import type { NextPage } from "next";
import { Box, Text, Spinner, Button, ButtonPrimary } from "@primer/components";
import { StopIcon, SyncIcon, CommentDiscussionIcon } from "@primer/octicons-react";
import { SideMenu } from "../components/SideMenu";
import { MentionMessageList } from "components/MentionMessageList";
import { Root } from "../components/Root";
import { supabase } from "service/supabase";
import Discover from "components/Discover";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Session } from "@supabase/gotrue-js";
import { useQuery } from "react-query";
import { MentionedMessageType } from "types";

const messageQuery = `
  id,
  content,
  created_at,
  mentions,
  user: users!user_id(
    username,
    avatar_url    
  ),
  chat: chats!chat_id(
    repo_owner,
    repo_name
  )
`;

const Home: NextPage = () => {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastChatId, setLastChatId] = useState<string | null>(null)

  useEffect(() => {
    const tempSession = supabase.auth.session();
    setIsAuthenticated(tempSession !== null);
    setSession(tempSession);
    if (tempSession !== null) {
      const tempLastChatId = localStorage.getItem("recent_chat");
      setLastChatId(tempLastChatId);
    }
  }, [])

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery(
    ["messages"],
    async () => {
      const user = supabase.auth.user();

      const { data, error } = await supabase
        .from<MentionedMessageType>("messages")
        .select(messageQuery)
        .cs('mentions', [user?.id]);

      if (error) {
        throw error;
      }

      return data || [];
    },
    { enabled: isAuthenticated, staleTime: Infinity }
  );

  if (!isAuthenticated) {
    return (
      <Root fixedScreenHeight={false}>
        <Discover />
      </Root>
    );
  }

  return (
    <Root fixedScreenHeight={true}>
      <Box bg="canvas.default" flexGrow={1} display="flex" flexDirection="row" height="100%">
        <SideMenu />
        <Box display="flex" flexDirection="column" flexGrow={1} height="100%" m={4}>
          {lastChatId && <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding={3}
            bg="canvas.overlay"
            borderWidth={1}
            borderRadius={6}
            borderColor="border.default"
            borderStyle="solid"
            mb={3}
          >
            <Text>
              Return to previous chat.
            </Text>
            <ButtonPrimary onClick={() => {
              router.push(`/chats/${lastChatId}`)
            }}>Go</ButtonPrimary>
          </Box>}
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
                    <Text>Loading feed...</Text>
                  </>
                )}
                {/* Error fetching messages */}
                {!!messagesError && !isMessagesLoading && (
                  <>
                    <StopIcon size="medium" />
                    <Text mt={2} textAlign="center">
                      Something went wrong trying to load feed.
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
                      {"There are no messages that mention you yet."} <br />
                      {"Join a chat and start some conversations!"}
                    </Text>
                  </>
                )}
              </Box>
            </Box>
          )}
          {messages && <MentionMessageList messages={messages} />}
        </Box>
      </Box>
    </Root>
  );
};

export default Home;
