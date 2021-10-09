import { Box, ButtonPrimary, Heading, Text, TextInput } from "@primer/components";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getActiveChats } from "service/supabase";
import { ActiveChat } from "types";
import { DiscoverMessage } from "./DiscoverMessage";

export default function Discover() {
  const router = useRouter();
  const [tryNowRepoPath, setTryNowRepo] = useState<string>();
  const handleTryNowRepoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTryNowRepo(e.target.value);
  };
  const [latestMessages, setLatestMessages] = useState<ActiveChat[]>([]);
  const { data: activeChatData } = useQuery("active_chats", async () => await getActiveChats().throwOnError());

  useEffect(() => {
    const chatsWithMessages: ActiveChat[] = activeChatData?.body || [];

    let messagesToAdd = chatsWithMessages.length;

    const intervalId = setInterval(() => {
      setLatestMessages(chatsWithMessages.slice(0, chatsWithMessages.length - messagesToAdd + 1));
      console.log("added messages!");

      messagesToAdd--;
      if (!messagesToAdd) {
        clearInterval(intervalId);
      }
    }, 1500);
    return () => {
      clearInterval(intervalId);
    };
  }, [activeChatData?.body]);

  console.log("msgs", latestMessages);

  const handleFormSubmit: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();

    if (tryNowRepoPath?.includes("github.com/")) {
      const [afterDomain] = tryNowRepoPath?.toLowerCase().split("github.com/").slice(-1);
      const [owner, name] = afterDomain.split("/");
      console.log(tryNowRepoPath, afterDomain, owner, name);
      if (owner && name) {
        router.push(`${owner}/${name}`);
      }
    } else {
      const [owner, name] = tryNowRepoPath?.split("/") || [];
      console.log(tryNowRepoPath, owner, name);
      if (owner && name) {
        router.push(`${owner}/${name}`);
      }
    }
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={4}>
      <Box display="flex" flexWrap="wrap" alignItems="center" maxWidth={1280} width="100%">
        <Box display="flex" flexDirection="column" width={["100%", null, "50%"]}>
          <Heading sx={{ fontSize: [5, 7], lineHeight: 1.25 }} textAlign={["center", "left"]}>
            A chat room for every GitHub repository. <br />
            Real-time.
          </Heading>
          <Box width={[1]} mt={4} display="flex" flexDirection="column">
            <Text fontSize={3} fontWeight={300} color="fg.muted" textAlign={["center", "left"]}>
              Try it now! Just paste a GitHub url or type a repository owner/name.
            </Text>
            <form onSubmit={handleFormSubmit}>
              <Box display="flex" flexDirection={["column", "row"]} mt={4}>
                <TextInput
                  placeholder="https://github.com/owner/name"
                  onChange={handleTryNowRepoChange}
                  sx={{ height: "42px", minWidth: ["250px"], flexGrow: 1 }}
                />
                <ButtonPrimary type="submit" variant="large" mt={[2, 0]} ml={[0, 2]}>
                  Chat now
                </ButtonPrimary>
              </Box>
            </form>
          </Box>
        </Box>
        <Box width={["100%", null, "50%"]}>
          <Box padding={4} height={"420px"}>
            <Box>
              <Text display="inline-block" color="fg.muted" sx={{ mb: [2] }}>
                Recent Messages
              </Text>
              {latestMessages.map((msg) => {
                return (
                  <DiscoverMessage
                    key={msg.id}
                    avatar={msg.avatar_url}
                    username={msg.username}
                    content={msg.content}
                    repoName={msg.repo_name}
                    repoOwner={msg.repo_owner}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
