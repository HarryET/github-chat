import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Text, Header, ButtonDanger, ButtonPrimary, BranchName, Avatar } from '@primer/components'
import { supabase } from '../_app';
import { useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const JoinInvite: NextPage = () => {
  const router = useRouter();
  const { code } = router.query

  const session = supabase.auth.session();
  const [isAuthenticated, setIsAuthenticated] = useState(session != null)

  if (typeof window !== "undefined") {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/invite/${code}`);
    }
  }

  const userMeta = session?.user?.user_metadata;
  const [profilePicUrl, setProfilePicUrl] = useState(userMeta?.avatar_url ?? "https://github.com/octocat.png")

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event == "SIGNED_IN" || event == "USER_UPDATED") {
      setProfilePicUrl(session?.user?.user_metadata.avatar_url);
      console.log(session?.user?.user_metadata.avatar_url);
      setIsAuthenticated(true);
    }
  });

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={2}>
            <span>GitHub Chat</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>
        </Header.Item>
        <Header.Item mr={0}>
          <Avatar src={profilePicUrl} size={32} square alt={userMeta?.user_name} />
        </Header.Item>
      </Header>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="100%">
        <Box bg="bg.secondary" display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={4}>
          <Text>Accepted invite to <BranchName>{"Author/RepoName"}</BranchName></Text>
          <Box display="flex" marginTop={3} flexDirection="row" justifyContent="center" alignItems="center">
            <ButtonPrimary onClick={() => {
              // Leave the chat that you were just invited too!
            }} marginRight={2}>Accept</ButtonPrimary>
            <ButtonDanger onClick={() => {
              // Leave the chat that you were just invited too!
            }}>Cancel</ButtonDanger>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default JoinInvite;
