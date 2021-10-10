import { Box } from "@primer/components";
import { useEffect, useRef } from "react";
import { MentionedMessageType } from "../types";
import { DiscoverMessage } from "./DiscoverMessage";

type Props = {
  messages: MentionedMessageType[];
};

export const MentionMessageList = ({ messages }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (current) {
      current.scrollTo(0, current.scrollHeight);
    }
  }, [messages]);

  return (
    <Box display="flex" flexDirection="column" ref={ref}>
      {messages &&
        messages.map((message) => (
          <DiscoverMessage
            key={message.id}
            content={message.content}
            avatar={message.user.avatar_url}
            username={message.user.username}
            repoName={message.chat.repo_name}
            repoOwner={message.chat.repo_owner}
          />
        ))}
    </Box>
  );
};
