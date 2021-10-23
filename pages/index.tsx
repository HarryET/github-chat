import type { InferGetStaticPropsType } from "next";
import { Box, Text, Spinner, Button, ButtonPrimary } from "@primer/components";
import { StopIcon, SyncIcon, CommentDiscussionIcon } from "@primer/octicons-react";
import { SideMenu } from "../components/SideMenu";
import { MentionMessageList } from "components/MentionMessageList";
import { Root } from "../components/Root";
import { supabase } from "service/supabase";
import { Discover } from "components/Discover";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Session } from "@supabase/gotrue-js";
import { useQuery } from "react-query";
import { MentionedMessageType, RecentChat } from "types";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { getRecentChat } from "service/localStorage";
import { buttonGradient } from "styles/styles";
import { ChatIcon } from "components/ChatIcon";
import { fetchMostPopularRepositories } from "../service/github";
import { PersonalLinks } from "components/PersonalLinks";
import { SocialIcons } from "components/SocialIcons";

const messageQuery = `
  id,
  content,
  created_at,
  mentions,
  user: users!user_id(
    username,
    avatar_url,
  ),
  chat: chats!chat_id(
    repo_owner,
    repo_name
  )
`;

export const getStaticProps = async () => {
  const repositories = await fetchMostPopularRepositories();
  return {
    props: { repositories },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Home = ({ repositories }: Props) => {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recentChat, setRecentChat] = useState<RecentChat>();

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, newSession: Session | null) => {
    // Authenticated
    if (event == "SIGNED_IN" || event == "USER_UPDATED") {
      setIsAuthenticated(true);
    }

    // Not authenticated
    if (event == "SIGNED_OUT" || event == "USER_DELETED") {
      setIsAuthenticated(false);
    }

    setSession(newSession);
  });

  useEffect(() => {
    const tempSession = supabase.auth.session();
    setIsAuthenticated(tempSession !== null);
    setSession(tempSession);
    if (tempSession !== null) {
      const recentChat = getRecentChat();
      if (recentChat) {
        setRecentChat(recentChat);
      }
    }
  }, []);

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
        .cs("mentions", [user?.id]);

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
        <Discover repositories={repositories} />
      </Root>
    );
  }

  return (
    <Root fixedScreenHeight={true}>
      <Box flexGrow={1} display="flex" flexDirection="row" overflow="hidden">
        <SideMenu router={router} display={["none", "none", "flex"]} />
        <Box
          height="100%"
          maxHeight="100%"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          px={4}
          py={4}
          overflowY="auto"
        >
          {recentChat && (
            <Box
              display={["none", "none", "flex"]}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              padding={3}
              mb={6}
              bg="canvas.overlay"
              borderWidth={1}
              borderRadius={6}
              borderColor="border.default"
              borderStyle="solid"
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Text color="fg.muted">Last chat:</Text>
                <Box ml={2}>
                  <ChatIcon icon={recentChat.repoOwnerAvatar} name={recentChat.repoName} iconSize={38} />
                </Box>
                <Text>{`${recentChat.repoOwner}/${recentChat.repoName}`} </Text>
              </Box>
              <ButtonPrimary
                sx={{
                  border: "none",
                  background: buttonGradient.default,
                  ":hover": {
                    background: buttonGradient.hover,
                  },
                }}
                variant="large"
                onClick={() => {
                  router.push(`/chats/${recentChat.id}`);
                }}
              >
                Go to chat
              </ButtonPrimary>
            </Box>
          )}
          <Text fontWeight="500" mb={3}>
            Mentions
          </Text>
          {(isMessagesLoading || !!messagesError || (messages && messages.length === 0)) && (
            <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
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
          <Box display="flex" flexDirection="column">
            <PersonalLinks />
            <SocialIcons />
          </Box>
        </Box>
      </Box>
    </Root>
  );
};

export default Home;
