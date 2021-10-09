import NextLink from "next/link";
import { Avatar, Box, Text, Link } from "@primer/components";

type MessageProps = {
  avatar: string;
  content: string;
  username: string;
  repoOwner: string;
  repoName: string;
};

export function DiscoverMessage({ avatar, username, content, repoOwner, repoName }: MessageProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      paddingX={3}
      paddingY={2}
      bg="canvas.overlay"
      borderWidth={1}
      borderRadius={6}
      borderColor="border.default"
      borderStyle="solid"
      mb={3}
    >
      <Avatar src={avatar} size={36} square alt={username} sx={{ flexShrink: 0 }} bg="neutral.muted" />
      <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
        <Text fontWeight="bold" fontSize={1} lineHeight={1}>
          {username}{" "}
          <Text fontWeight="200" color={"fg.muted"}>
            in{" "}
            <NextLink href={`${repoOwner}/${repoName}`}>
              <Link color={"fg.muted"}>
                {repoOwner}/{repoName}
              </Link>
            </NextLink>
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
          {content}
        </Text>
      </Box>
    </Box>
  );
}
