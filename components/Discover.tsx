import { Box, ButtonPrimary, Heading, Text, TextInput } from "@primer/components";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { useQuery } from "react-query";
import { getActiveChats } from "service/supabase";
import { DiscoverMessage } from "./DiscoverMessage";

export default function Discover() {
  const router = useRouter();
  const [tryNowRepoPath, setTryNowRepo] = useState<string>();
  const handleTryNowRepoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTryNowRepo(e.target.value);
  };
  // TODO Handle loading & error
  const { data: latestMessages } = useQuery("active_chats", async () =>
    getActiveChats()
      .throwOnError()
      .then(({ data }) => data)
  );

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
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingX={[3, 4]}
      paddingY={4}
      // TODO Fix on mobile so scroll works
      // overflowY="scroll"
    >
      <Box display="flex" flexDirection={["column", "column", "row"]} alignItems="center" maxWidth={1280} width="100%">
        <Box display="flex" flexDirection="column" flex={1} mr={[0, 0, 6]}>
          <Heading sx={{ fontSize: [5, 7], lineHeight: 1.25 }} textAlign={["center", "left"]}>
            A chat room for every GitHub repository. <br />
            Real-time.
          </Heading>
          <Box width={[1]} mt={4} display="flex" flexDirection="column">
            <Text fontSize={3} fontWeight={300} color="fg.muted" textAlign={["center", "left"]}>
              Paste a GitHub url or type a repository owner/name.
            </Text>
            <form onSubmit={handleFormSubmit}>
              <Box display="flex" flexDirection={["column", "column", "row"]} mt={4}>
                <Box display="flex" flexDirection={["column", "row"]} alignItems={["left", "center"]}>
                  <Text fontSize={2} mr={2} mb={[2, 0]}>
                    https://github.com/
                  </Text>
                  <TextInput
                    placeholder="owner/name"
                    onChange={handleTryNowRepoChange}
                    sx={{ fontSize: 2, height: "48px", minWidth: ["250px"], flexGrow: 1 }}
                  />
                </Box>
                <ButtonPrimary height="48px" type="submit" variant="large" mt={[2, 2, 0]} ml={[0, 0, 2]}>
                  Chat now
                </ButtonPrimary>
              </Box>
            </form>
          </Box>
        </Box>
        <Box flex={1} ml={[0, 0, 6]} mt={[6, 6, 0]} padding={[0, 0, 0]} width="100%">
          <Box>
            <Text display="inline-block" color="fg.muted" mb={3}>
              Recent Messages
            </Text>
            {latestMessages &&
              latestMessages.map((msg) => {
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
  );
}
