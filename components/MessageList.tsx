import { Box } from "@primer/components";
import { useEffect, useRef } from "react";
import { MessageType } from "../types";
import { Message } from "./MessageFoo";

type Props = {
  messages: MessageType[];
};

export const MessageList = ({ messages }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (current) {
      current.scrollTo(0, current.scrollHeight);
    }
  }, [messages]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      overflowY="scroll"
      ref={ref}
    >
      {messages &&
        messages.map((message) => (
          <Message
            key={message.id}
            avatar={message.author.user.avatar_url}
            username={message.author.nickname || message.author.user.username}
            content={message.content}
          />
        ))}
    </Box>
  );
};
