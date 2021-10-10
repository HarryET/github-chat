import { Avatar, Box, Text } from "@primer/components";
import React from "react";
import { Markdown } from "./Markdown";
import type { MessageType } from "types";
import * as datefns from "date-fns";

type MessageProps = {
  message: MessageType;
};

const formatDate = (dateISOFormat: string) => {
  const date = datefns.parseISO(dateISOFormat);
  if (datefns.isToday(date) || datefns.isYesterday(date)) {
    return `${datefns.isToday(date) ? "Today" : "Yesterday"} at ${datefns.format(date, "HH:mm")}`;
  }
  return datefns.format(date, "dd/MM/yyyy");
};

export const Message = ({ message }: MessageProps) => {
  return (
    <Box display="flex" flexDirection="row" paddingX={[2, 2, 3]} paddingY="12px">
      <Avatar
        src={message.user.avatar_url}
        size={36}
        square
        alt={message.user.username}
        sx={{ flexShrink: 0 }}
        bg="neutral.muted"
      />
      <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <Text color="#dfe5ee" fontWeight="bold" fontSize={1} lineHeight={1}>
            {message.user.username}
          </Text>
          <Text fontSize={0} fontWeight={300} color="fg.muted" lineHeight={1} ml={2}>
            {formatDate(message.created_at)}
          </Text>
        </Box>
        <Text
          color="#bfc8d3"
          mt={2}
          fontSize={1}
          style={{
            overflowWrap: "break-word",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <Markdown content={message.content} />
        </Text>
      </Box>
    </Box>
  );
};
