import { Avatar, Box, Button, Label, StyledOcticon, Text } from "@primer/components";
import React from "react";
import { Markdown } from "./Markdown";
import { MessageFile, MessageType, UserStaffFlag, UserSystemFlag } from "types";
import * as datefns from "date-fns";
import { DownloadIcon } from "@primer/octicons-react";
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
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="start">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="start">
            <Text color="#dfe5ee" fontWeight="bold" fontSize={1} lineHeight={1}>
              {message.user.username}
            </Text>
            {(message.user.flags & UserStaffFlag) != 0 && <Label variant="small" sx={{ bg: "canvas.secondary", m: 1 }}>👨🏻‍💻 team</Label>}
            {(message.user.flags & UserSystemFlag) != 0 && <Label variant="small" sx={{ bg: "canvas.secondary", m: 1 }}>🤖 system</Label>}
          </Box>
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
          <Box mb={(message.files ?? []).length > 0 ? 2 : 0}>
            <Markdown content={message.content} />
          </Box>
          {(message.files ?? []).length > 0 && <Box display="flex" flexDirection="row" alignItems="flex-start">
            {message.files.map((messageFile) => <FileBox key={messageFile.id} file={messageFile} />)}
          </Box>}
        </Text>
      </Box>
    </Box>
  );
};

const FileBox = ({ file }: { file: MessageFile }) => {
  const handleDownloadClick = async () => {
    const { data, error } = await supabase.storage.from("public").download(`uploads/${file.id}`);
    console.log(data, error);

    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", file.name);
    tempLink.click();
  };

  return (
    <Box height="100%" sx={{ maxWidth: "300px" }}>
      <Button
        ml={2}
        sx={{
          border: "none",
          background: "fg.subtle",
          height: "40px",
          maxWidth: "300px",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
        onClick={handleDownloadClick}
      >
        <StyledOcticon icon={DownloadIcon} />{" "}
        <Text
        // sx={{
        //   maxWidth: "50px",
        //   textOverflow: "ellipsis",
        //   display: "inline-block",
        // }}
        >
          {file.name}
        </Text>
      </Button>
    </Box>
  );
};
