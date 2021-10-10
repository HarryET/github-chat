import { Box, ButtonPrimary, Heading, Text } from "@primer/components";
import { useRouter } from "next/router";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { useQuery } from "react-query";
import { getActiveChats } from "service/supabase";
import { DiscoverMessage } from "./DiscoverMessage";
import { PersonalLinks } from "./PersonalLinks";
import { SocialIcons } from "./SocialIcons";
import { ThemeConfig } from "react-select";
import AsyncSelect from "react-select/async";
import primitives from "@primer/primitives";
import { Repository } from "types";
import leven from "leven";
import pDebounce from "p-debounce";
import { Octokit } from "@octokit/rest";
import { buttonGradient } from "styles/styles";

const { colors } = primitives;

type Props = {
  repositories: Repository[];
};

const theme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    neutral0: colors.dark.bg.secondary,
    neutral20: colors.dark.fg.subtle,
    neutral30: colors.dark.fg.muted,
    neutral50: colors.dark.fg.muted,
    primary25: "#222933",
    neutral80: colors.dark.fg.default,
  },
});

const octokit = new Octokit();

type Option = { value: string; label: string };

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

  const loadOptions = async (inputValue: string, callback: (options: Option[]) => void) => {
    const results = repositories
      .filter((repository) => repository.fullName.includes(inputValue))
      .sort((a, b) => leven(a.fullName, inputValue) - leven(b.fullName, inputValue));

    // First we try searching among the statically pre-fetched 500 most popular repositories
    if (results.length > 0) {
      callback(results.map((r) => ({ label: r.fullName, value: r.fullName })));
    }

    const { data } = await octokit.rest.search.repos({
      per_page: 20,
      q: `${inputValue} in:name`,
      sort: "stars",
    });

    // If not found, we use GitHub search API
    const remoteResults = data.items
      .map((item) => ({
        id: item.id.toString(),
        fullName: item.full_name,
        owner: item.owner?.login,
        name: item.name,
      }))
      .filter((repository) => repository.fullName.includes(inputValue))
      .sort((a, b) => leven(a.fullName, inputValue) - leven(b.fullName, inputValue));

    callback(remoteResults.map((r) => ({ label: r.fullName, value: r.fullName })));
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
                <AsyncSelect<Option>
                  placeholder="Search GitHub repository"
                  isSearchable={true}
                  loadOptions={pDebounce(loadOptions, 500)}
                  styles={{
                    container: (css) => ({ ...css, flex: 1 }),
                    control: (css) => ({
                      ...css,
                      height: "48px",
                      flex: 1,
                      flexGrow: 1,
                      width: "100%",
                    }),
                    menu: (css) => ({ ...css, border: `1px solid ${colors.dark.border.default}` }),
                  }}
                  theme={theme}
                  onChange={(option) => setRepository(option?.value)}
                />
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
          <Box display="flex" flexDirection="column" overflowY="auto">
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
