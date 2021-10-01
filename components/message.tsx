import { Header, ButtonOutline, Avatar, Box, SideNav, Text } from '@primer/components'

type MessageProps = {
  avatar: string,
  content: string,
  username: string
}

const Message = ({ avatar, username, content }: MessageProps) => {
  return (
    <Box display="flex" flexDirection="row" padding={2}>
      <Avatar src={avatar} size={48} square alt={username} />
      <Box display="flex" flexDirection="column" width="100%" marginLeft={3}>
        <Text fontWeight="bold">{username}</Text>
        <Text style={{
          overflowWrap: "break-word",
          maxWidth: "100%"
        }}>{content}</Text>
      </Box>
    </Box>
  );
}

export default Message;