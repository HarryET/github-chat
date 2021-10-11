import { Avatar, Box, Button, StyledOcticon, Text } from "@primer/components";
import React from "react";
import { Markdown } from "./Markdown";
import type { MessageType } from "types";
import * as datefns from "date-fns";
import { DownloadIcon, FileIcon } from "@primer/octicons-react";
import { supabase } from "service/supabase";

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
          {message.type === 1 && <Markdown content={message.content} />}
          {message.type === 2 && <FileMessage message={message} />}
        </Text>
      </Box>
    </Box>
  );
};

const FileMessage = ({ message }: MessageProps) => {
  const handleDownloadClick = async () => {
    const { data, error } = await supabase.storage.from("public").download(message.content);
    console.log(data, error);

    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", message.file_name || message.content);
    tempLink.click();
  };

  return (
    <Box height="100%">
      <Button
        ml={2}
        sx={{
          border: "none",
          background: "fg.subtle",
          height: "40px",
        }}
        onClick={handleDownloadClick}
      >
        <StyledOcticon icon={DownloadIcon} /> <Text>{message.file_name}</Text>
      </Button>
    </Box>
  );
};
