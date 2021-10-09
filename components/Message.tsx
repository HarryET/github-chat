import { Avatar, Box, Text, BranchName } from "@primer/components";
import { useEffect, useState } from "react";
import reactStringReplace from "react-string-replace";
// @ts-ignore
import Twemoji from 'react-twemoji';
import { supabase } from "service/supabase";
import type { User } from 'types'

type MessageProps = {
  content: string;
  author: User;
};

export const Message = ({ author, content }: MessageProps) => {
  // Stores a link between userid and username
  const [mentionsData, setMentionsData] = useState<Record<string, User>>({
    [author.id]: author
  });

  useEffect(() => {
    const rawRegexMatches = content.matchAll(/<@([A-Za-z0-9\-]+)>/gmi);
    const rawMatches: string[] = []; for (let row of rawRegexMatches) for (let e of row) rawMatches.push(e);
    rawMatches.forEach(async (rawId) => {
      const id = rawId.replace("<@", "").replace(">", "");
      console.log(rawId, id);
      const { data: userData } = await supabase
        .from<User>("users")
        .select(`id,
        username, 
        avatar_url`)
        .limit(1)
        .eq("id", id)

      if ((userData ?? []).length > 0) {
        const user: User = userData![0]!;
        setMentionsData({
          ...mentionsData,
          [user.id]: user
        });
      }
    })
  }, [])

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
          <Twemoji options={{ className: 'emoji' }}>
            {reactStringReplace(reactStringReplace(content, "\n", () => <br />), /<@([A-Za-z0-9\-]+)>/gmi, (match) => {
              const userId = match.replace("<@", "").replace(">", "");

              const user = mentionsData[userId];
              if (user) {
                return (<BranchName href={`https://github.com/${user.username}`}>
                  @{user.username}
                </BranchName>);
              } else {
                return (<BranchName>
                  @{userId}
                </BranchName>);
              }
            })}
          </Twemoji>
        </Text>
      </Box>
    </Box>
  );
};
