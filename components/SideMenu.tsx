import { Box, SideNav, Text, ButtonPrimary, Spinner } from "@primer/components";
import { PlusIcon } from "@primer/octicons-react";
import { useRouter } from "next/dist/client/router";
import { useQuery } from "react-query";
import { Chat } from "../types";
import { supabase } from "../pages/_app";

type Props = {
  selectedChatId?: string;
};

export const SideMenu = ({ selectedChatId }: Props) => {
  const router = useRouter();

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

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
      chat: chat_id (
        id,
        github_repo_id,
        repo_owner,
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
    <Box height="100%" minWidth={360} width={360} flexShrink={1} padding={4}>
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
      {isChatsLoading && !chats && <Spinner />}
      {chatsError && <Text>Failed to load chats</Text>}
      {chats && chats.length > 0 && (
        <SideNav bordered maxWidth={360} aria-label="Main">
          {chats.map((chat) => (
            <SideNav.Link
              key={chat.id}
              href={`/chats/${chat.id}`}
              selected={chat.id === selectedChatId}
            >
              <Text>
                {chat.repo_owner}/{chat.repo_name}
              </Text>
            </SideNav.Link>
          ))}
        </SideNav>
      )}
    </Box>
  );
};
