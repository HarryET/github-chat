import { Box, ButtonPrimary, Heading, Text } from "@primer/components";
import { useRouter } from "next/router";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { useQuery } from "react-query";
import { getActiveChats } from "service/supabase";
import { DiscoverMessage } from "./DiscoverMessage";
import { PersonalLinks } from "./PersonalLinks";
import { SocialIcons } from "./SocialIcons";
import primitives from "@primer/primitives";
import { Repository } from "types";
import { buttonGradient, hideScrollBar } from "styles/styles";
import { Search } from "./Search";

type Props = {
  repositories: Repository[];
};

export const Discover = ({ repositories }: Props) => {
  const router = useRouter();

  const [repository, setRepository] = useState<string>();

  // TODO Handle loading & error
  const { data: latestMessages } = useQuery("active_chats", async () =>
    getActiveChats()
      .throwOnError()
      .then(({ data }) => data)
  );

  const handleFormSubmit: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!!repository) {
      router.push(`/${repository}`);
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
    >
      <Box
        display="flex"
        minHeight="100%"
        flexDirection={["column", "column", "row"]}
        alignItems="stretch"
        maxWidth={1280}
        width="100%"
      >
        <Box display="flex" flexDirection="column" justifyContent="space-between" flex={1} mr={[0, 0, 6]}>
          <Box />
          <Box width={[1]} display="flex" flexDirection="column">
            <Heading sx={{ fontSize: [6, 7], lineHeight: 1.25 }} textAlign={["center", "left"]}>
              A chat room for every GitHub repository. <br />
              Real-time.
            </Heading>
            <Text mt={4} fontSize={3} fontWeight={300} color="fg.muted" textAlign={["center", "left"]}>
              Type a repository owner/name.
            </Text>
            <form onSubmit={handleFormSubmit}>
              <Box
                display="flex"
                flexDirection={["column", "column", "row"]}
                mt={4}
                maxWidth={["none", "none", "540px"]}
              >
                <Search repositories={repositories} onSelect={setRepository} />
                <ButtonPrimary
                  height="48px"
                  type="submit"
                  variant="large"
                  mt={[3, 3, 0]}
                  ml={[0, 0, 2]}
                  sx={{
                    border: "none",
                    background: buttonGradient.default,
                    ":hover": {
                      background: buttonGradient.hover,
                    },
                  }}
                >
                  Chat now
                </ButtonPrimary>
              </Box>
            </form>
          </Box>
          <Box display="flex" flexDirection="column">
            <PersonalLinks sx={{ display: ["none", "none", "block"] }} />
            <SocialIcons mt={2} sx={{ display: ["none", "none", "flex"] }} />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          ml={[0, 0, 6]}
          mt={[6, 6, 0]}
          padding={[0, 0, 0]}
          position="relative"
          maxHeight={["none", "none", "75vh"]}
          width="100%"
          overflowY={["auto", "auto", "hidden"]}
        >
          <Text display="inline-block" color="fg.muted" mb={3}>
            Recent Messages
          </Text>
          <Box display="flex" flexDirection="column" overflowY="auto" sx={hideScrollBar}>
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
          <Box
            background="linear-gradient(rgba(0,0,0,0), rgba(13,17,23,0.7))"
            display={["none", "none", "block"]}
            position="absolute"
            width="100%"
            height="32px"
            bottom={0}
          />
        </Box>
      </Box>
      <PersonalLinks mt={8} sx={{ display: ["block", "block", "none"] }} />
      <SocialIcons mt={2} mb={4} sx={{ display: ["flex", "flex", "none"] }} />
    </Box>
  );
};
