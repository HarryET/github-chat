import { Box } from "@primer/components";
import { useEffect, useRef } from "react";
import { MessageType } from "../types";
import { Message } from "./Message";

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
    <Box display="flex" flexDirection="column" flex={1} ref={ref} flexBasis={0} flexGrow={1} overflowY="auto">
      {messages && messages.map((message) => <Message key={message.id} message={message} />)}
    </Box>
  );
};
