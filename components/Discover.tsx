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
    <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={4}>
      <Box display="flex" flexWrap="wrap" alignItems="center" maxWidth={1280}>
        <Box display="flex" flexDirection="column" width={["100%", "100%", "50%"]}>
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
                  flexGrow={1}
                  placeholder="https://github.com/owner/name"
                  onChange={handleTryNowRepoChange}
                  sx={{ height: "42px", minWidth: "400px" }}
                />
                <ButtonPrimary type="submit" variant="large" mt={[2, 0]} ml={[0, 2]}>
                  Chat now
                </ButtonPrimary>
              </Box>
            </form>
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
    </Box>
  );
}
