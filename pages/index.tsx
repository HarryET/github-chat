import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
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
import { MentionedMessageType, RecentChat, Repository } from "types";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { getRecentChat } from "service/localStorage";
import { buttonGradient } from "styles/styles";
import { Octokit } from "@octokit/rest";

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

export const getStaticProps = async () => {
  const octokit = new Octokit({});

  const repositories: Repository[] = [];
  const numPages = 5;

  for (let i = 0; i < numPages; i++) {
    const { data } = await octokit.rest.search.repos({
      per_page: 100,
      q: "stars:>=500",
      page: i + 1,
      sort: "stars",
    });
    repositories.push(
      ...data.items.map((item) => ({
        id: item.id.toString(),
        fullName: item.full_name,
        owner: item.owner?.login,
        name: item.name,
      }))
    );
  }

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
        <SideMenu />
        <Box
          height="100%"
          maxHeight="100%"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          px={4}
          py={3}
          overflowY="auto"
        >
          {recentChat && (
            <Box
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
            >
              <Box display="flex">
                <Text color="fg.muted">Last chat:</Text>
                <Text ml={2}>{`${recentChat.repoOwner}/${recentChat.repoName}`} </Text>
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
          <Text fontWeight="500" mt={6} mb={3}>
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
        </Box>
      </Box>
    </Root>
  );
};

export default Home;
