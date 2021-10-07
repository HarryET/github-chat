import { Avatar, Box, Text } from "@primer/components";
// @ts-ignore
import Twemoji from 'react-twemoji';

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
            {content}
          </Twemoji>
        </Text>
      </Box>
    </Box>
  );
};
