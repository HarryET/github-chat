import Link from "next/link";
import { Avatar, Box, Text } from "@primer/components";
import {Markdown} from "./Markdown";

type MessageProps = {
  avatar: string;
  content: string;
  username: string;
  repoOwner: string;
  repoName: string;
};

export function DiscoverMessage({ avatar, username, content, repoOwner, repoName }: MessageProps) {
  return (
    <Link href={`/${repoOwner}/${repoName}`} passHref>
      <Box
        display="flex"
        flexDirection="row"
        padding={3}
        bg="canvas.overlay"
        borderWidth={1}
        borderRadius={6}
        borderColor="border.default"
        borderStyle="solid"
        mb={3}
        sx={{
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          ":hover": {
            backgroundColor: "#181e25",
            borderColor: "#394047",
          },
        }}
      >
        <Avatar src={avatar} size={36} square alt={username} sx={{ flexShrink: 0 }} bg="neutral.muted" />
        <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
          <Text fontWeight="bold" fontSize={1} lineHeight={1}>
            {username}{" "}
            <Text fontWeight="200" color={"fg.muted"} fontSize={0}>
              in <Text color={"fg.muted"} sx={{ cursor: "pointer" }}>{`${repoOwner}/${repoName}`}</Text>
            </Text>
          </Text>
          <Text
            mt={2}
            fontSize={1}
            style={{
              overflowWrap: "break-word",
              maxWidth: "100%",
            }}
          >
            <Markdown content={content} />
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
