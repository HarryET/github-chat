import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Text, ButtonPrimary, BranchName, SideNav } from '@primer/components'
import { PlusIcon } from '@primer/octicons-react'
import { supabase } from '../_app';
import Header from "../../components/header";
import Message from "../../components/message";
import { useEffect, useState } from 'react';

const ViewChat: NextPage = () => {
  const router = useRouter();
  const { chat: id } = router.query

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  if (typeof window !== "undefined") {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/`);
    }
  }

  const [chats, setChats] = useState([] as {
    id: string;
    github_repo_id: string;
    // created_at: Date;
    // owner_id: string;
    repo_owner: string;
    repo_name: string;
    // repo_description: string;
    // repo_data_last_update: Date;
  }[]);

  const [messages, setMessages] = useState([] as {
    id: string;
    author: {
      id: string;
      username: string;
      nickname?: string;
      avatar_url: string;
    };
    content: string;
    edited_at?: Date;
    created_at: Date;
  }[]);

  useEffect(() => {
    (async () => {
      if (userMeta != null) {
        const { data, error } = await supabase
          .from("members")
          .select(`
            id,
            chat_id (
              id,
              github_repo_id,
              repo_owner,
              repo_name
            )
          `)
          .eq("user_id", session?.user?.id)

        if (data == null) {
          // TODO handle no data!
          return;
        }

        if (error) {
          // TODO handle error!
          return;
        }

        setChats(data.map((member) => member.chat_id));
      } else {
        // TODO handle no auth!
      }
    })()
  }, [session?.user?.id, userMeta])

  useEffect(() => {
    (async () => {
      if (userMeta != null && id != null) {
        const { data, error } = await supabase
          .from("messages")
          // TODO Fix major bugs
          .select(`
            id,
            chat_id,
            content,
            created_at,
            edited_at,
            member_id (
              id,
              nickname,
            ),
            member_id:user_id (
              raw_user_meta_data
            )
          `)
          .eq("chat_id", id)

        if (data == null) {
          // TODO handle no data!
          return;
        }

        if (error) {
          // TODO handle error!
          return;
        }

        setMessages(data.map((message) => {
          return {
            id: message.id,
            author: {
              id: message.member_id.id,
              username: "Octocat",
              nickname: message.member_id.nickname,
              avatar_url: "https://github.com/octocat.png",
            },
            content: message.content,
            edited_at: message.edited_at,
            created_at: message.created_at,
          };
        }));

        console.log(messages);
      } else {
        // TODO handle no auth!
      }
    })()
  }, [id, session?.user?.id, userMeta])

  return (
    <Box>
      <Header showAvatar={true} />
      <Box bg="bg.primary" display="flex" flexDirection="row" alignItems="start" justifyContent="center" height="100%">
        <Box width="25%" height="100%" padding={4}>
          <Box width="100%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={3} style={{
            maxWidth: "360px"
          }}>
            <Text fontWeight="bold">Your Chats:</Text>
            <ButtonPrimary variant="small" onClick={() => router.push("/chats/new")}>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                <PlusIcon size={18} />
                <Box paddingLeft={2}>
                  <Text>New</Text>
                </Box>
              </Box>
            </ButtonPrimary>
          </Box>
          <SideNav bordered maxWidth={360} aria-label="Main">
            {chats.length > 0 && chats.map((chat) => {
              return (
                <SideNav.Link key={chat.id} href={`/chats/${chat.id}`} selected={id == chat.id}>
                  <Text>{chat.repo_owner}/{chat.repo_name}</Text>
                </SideNav.Link>
              );
            })}
          </SideNav>
        </Box>
        <Box width="75%" height="100%" >
          {messages.length > 0 && messages.map((message) => <Message key={message.id} avatar={message.author.avatar_url} username={message.author.username} content={message.content} />)}
        </Box>
      </Box>
    </Box>
  )
}

export default ViewChat;
