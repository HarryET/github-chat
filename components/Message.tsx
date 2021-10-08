import { Avatar, Box, Text, BranchName } from "@primer/components";
import reactStringReplace from "react-string-replace";
// @ts-ignore
import Twemoji from 'react-twemoji';
import { supabase } from "service/supabase";
import type { User } from 'types'

type MessageProps = {
  avatar: string;
  content: string;
  username: string;
};

export const Message = ({ avatar, username, content }: MessageProps) => {
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
        src={avatar}
        size={36}
        square
        alt={username}
        sx={{ flexShrink: 0 }}
        bg="neutral.muted"
      />
      <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
        <Text fontWeight="bold" fontSize={1} lineHeight={1}>
          {username}
        </Text>
        <Text
          mt={2}
          fontSize={1}
          style={{
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          <Twemoji options={{ className: 'emoji' }}>
            { /*! CANNOT BE ASYNC NEEDS FIX !*/ }
            {reactStringReplace(content, /(<@)([A-Za-z0-9\-]+)(>)/gmi, async (match, i, offset) => {
              const userId = match.replace("<@", "").replace(">", "");
              const { data: users } = await supabase
                .from<User>("users")
                .select(`id,
                  username, 
                  avatar_url`)
                .eq("id", userId)
              if ((users ?? []).length > 0) {
                const user = users![0]!

                return (
                  <BranchName>
                    {user.username}
                  </BranchName>
                )
              } else {
                return (
                  <BranchName>
                    {userId}
                  </BranchName>
                )
              }
            })}
          </Twemoji>
        </Text>
      </Box>
    </Box>
  );
};
