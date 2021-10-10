import { Box, SideNav, Text, Spinner, Avatar } from "@primer/components";
import { useQuery } from "react-query";
import { Chat } from "../types";
import Link from "next/link";
import { supabase } from "service/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/gotrue-js";
import { ChatIcon } from "./ChatIcon";

type Props = {
  selectedChatId?: string;
};

export const SideMenu = ({ selectedChatId }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const reqSession = supabase.auth.session();
    setSession(reqSession);
    setIsAuthenticated(reqSession !== null);
  }, []);

  const {
    data: chats,
    isLoading: isChatsLoading,
    isError: chatsError,
  } = useQuery<Chat[]>(
    "user-chats",
    async () => {
      const { data, error } = await supabase
        .from("members")
        .select(
          `
      id,
      chat: chats!chat_id (
        id,
        github_repo_id,
        repo_owner,
        repo_owner_avatar,
        repo_name
      )
    `
        )
        .eq("user_id", session?.user?.id);
      if (error) {
        throw error;
      }
      return data?.map((entry) => entry.chat) || [];
    },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box height="100%" width={360} flexShrink={0} padding={4}>
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
      </Box>
      {isChatsLoading && !chats && <Spinner />}
      {chatsError && <Text>Failed to load chats</Text>}
      {chats && chats.length > 0 && (
        <SideNav bordered maxWidth={360} aria-label="Main">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
              <SideNav.Link selected={chat.id === selectedChatId}>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center">
                  <ChatIcon icon={chat.repo_owner_avatar} name={chat.repo_name} iconSize={38} />
                  <Text>
                    {chat.repo_owner}/{chat.repo_name}
                  </Text>
                </Box>
              </SideNav.Link>
            </Link>
          ))}
        </SideNav>
      )}
    </Box>
  );
};
