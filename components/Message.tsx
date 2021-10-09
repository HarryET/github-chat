import { Avatar, Box, Text } from "@primer/components";
import React from "react";
import {Markdown} from "./Markdown";
import type { User } from "types";

type MessageProps = {
  content: string;
  author: User;
};

export const Message = ({ author, content }: MessageProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      paddingX={3}
      paddingY={2}
      sx={{
        ":hover": {
          bg: "canvas.subtle",
        },
      }}
    >
      <Avatar
        src={author.avatar_url}
        size={36}
        square
        alt={author.username}
        sx={{ flexShrink: 0 }}
        bg="neutral.muted"
      />
      <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
        <Text fontWeight="bold" fontSize={1} lineHeight={1}>
          {author.username}
        </Text>
        <Text
          mt={2}
          fontSize={1}
          style={{
            overflowWrap: "break-word",
            maxWidth: "100%",
            maxHeight: "100%"
          }}
        >
          <Markdown content={content} />
        </Text>
      </Box>
    </Box>
  );
};
