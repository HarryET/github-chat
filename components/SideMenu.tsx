import { Box, SideNav, Text, Spinner } from "@primer/components";
import { useQuery } from "react-query";
import { Chat } from "../types";
import Link from "next/link";
import { supabase } from "service/supabase";
import { ComponentProps, useEffect, useState } from "react";
import { Session } from "@supabase/gotrue-js";
import { ChatIcon } from "./ChatIcon";
import { Search } from "./Search";
import { NextRouter } from "next/router";

type Props = {
  selectedChatId?: string;
  router: NextRouter;
  onSelect?: () => void;
} & ComponentProps<typeof Box>;

export const SideMenu = ({ selectedChatId, router, onSelect, ...boxProps }: Props) => {
  const user = supabase.auth.user();
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
    refetch,
  } = useQuery<Chat[]>(
    ["user-chats"],
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
      return (
        data
          ?.map((entry) => entry.chat)
          .sort((a, b) => `${a.repo_owner}${a.repo_name}`.localeCompare(`${b.repo_owner}${b.repo_name}`)) || []
      );
    },
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    supabase
      .from<{ user_id: string }>("members")
      .on("*", async (payload) => {
        const { new: row } = payload;
        if (row.user_id === user?.id) {
          refetch();
        }
      })
      .subscribe();
  }, []);

  const handleSelectRepository = (name: string) => {
    if (onSelect) {
      onSelect();
    }
    router.push(`/${name}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box flexDirection="column" height="100%" width={360} flexShrink={0} padding={4} overflow="hidden" {...boxProps}>
      <Search repositories={[]} stretch={false} onSelect={handleSelectRepository} />
      {isChatsLoading && !chats && <Spinner mt={4} />}
      {chatsError && <Text mt={4}>Failed to load chats</Text>}
      {chats && chats.length > 0 && (
        <SideNav bordered maxWidth={360} aria-label="Main" mt={4} flexBasis={0} overflowY="auto" flexGrow={1}>
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
              <SideNav.Link selected={chat.id === selectedChatId} onClick={onSelect}>
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
