import { Box, Button, ButtonPrimary, Heading, Label, Text, TextInput } from "@primer/components";
import router, { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { Message } from "./Message";

export default function Discover() {
  const router = useRouter();
  const [tryNowRepoPath, setTryNowRepo] = useState<string>();
  const handleTryNowRepoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTryNowRepo(e.target.value);
  };

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
    <Box p={8} display="flex" flexWrap="wrap" sx={{ my: "8" }}>
      <Box display="flex" flexDirection="column" width={["100%", "100%", "50%"]}>
        <Heading sx={{ fontSize: [5, 7], mb: "8" }}>
          The fastest way to chat for any GitHub Repository. In realtime.
        </Heading>
        <Box width={[1]} display="flex" flexDirection="column">
          <Text fontSize={3}>Try it now! Just paste a GitHub url or type a repository owner/name.</Text>
          <Box pt="4">
            <form onSubmit={handleFormSubmit}>
              <TextInput
                width={1 / 2}
                placeholder="https://github.com/owner/name"
                onChange={handleTryNowRepoChange}
                sx={{ mr: 2 }}
              />
              <ButtonPrimary type="submit">Chat now</ButtonPrimary>
            </form>
          </Box>
        </Box>
      </Box>
      <Box width={["100%", "100%", "50%"]}>
        <Box>
          <Box padding={4}>
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="HarryET"
              content="Hey! I'd like to contribute to this project. Is issue #22 up for grabs?"
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="kiwicopple"
              content="Foo bar!"
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="kiwicopple"
              content="Hello world!"
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="kiwicopple"
              content="Hello world!"
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="kiwicopple"
              content="Hello world!"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
