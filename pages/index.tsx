import type { NextPage } from "next";
import { Box, SideNav, Text, ButtonPrimary, Spinner } from "@primer/components";
import { PlusIcon } from "@primer/octicons-react";
import { supabase } from "./_app";
import { useRouter } from "next/dist/client/router";
import Message from "../components/message";
import Header from "../components/header";
import { useQuery } from "react-query";
import { Chat } from "../types";

const Home: NextPage = () => {
  const router = useRouter();

  // Need to refetch the chats based on this?
  const session = supabase.auth.session();
  const userMeta = session?.user?.user_metadata;

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
    { enabled: true }
  );

  return (
    <Box>
      <Header showAvatar={true} />
      <Box
        bg="bg.primary"
        display="flex"
        flexDirection="row"
        alignItems="start"
        justifyContent="center"
        height="100%"
      >
        <Box width="25%" height="100%" padding={4}>
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
                <SideNav.Link key={chat.id} href={`/chats/${chat.id}`}>
                  <Text>
                    {chat.repo_owner}/{chat.repo_name}
                  </Text>
                </SideNav.Link>
              ))}
            </SideNav>
          )}
        </Box>
        <Box width="75%" height="100%">
          <h3>Your Feed:</h3>
          <Box width="100%" padding={4}>
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="HarryET"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/10214025?v=4"
              username="kiwicopple"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/4266663?v=4"
              username="SebLague"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/458736?v=4"
              username="awalias"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/18113850?v=4"
              username="dshukertjr"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
