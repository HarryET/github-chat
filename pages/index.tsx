import type { NextPage } from 'next'
import { Header, ButtonOutline, Avatar, Box } from '@primer/components'
import { supabase } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const Home: NextPage = () => {
  const router = useRouter();

  const [session, setSession] = useState(supabase.auth.session());
  const [isAuthenticated, setIsAuthenticated] = useState(session != null)

  const userMeta = session?.user?.user_metadata;
  const [profilePicUrl, setProfilePicUrl] = useState(userMeta?.avatar_url ?? "https://github.com/octocat.png")

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session : Session | null) => {
    if(event == "SIGNED_IN" || event == "USER_UPDATED") {
      setProfilePicUrl(session?.user?.user_metadata.avatar_url);
      console.log(session?.user?.user_metadata.avatar_url);
      setIsAuthenticated(true);
    }
  });

  return (
    <Box>
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={3}>
            <span>GitHub Chat</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>
        </Header.Item>
        <Header.Item mr={0}>
          {isAuthenticated && <Avatar src={profilePicUrl} size={32} square alt="@octocat"/>}
          {!isAuthenticated && <ButtonOutline variant="small" onClick={() => router.push("/login")} >Login</ButtonOutline>}
        </Header.Item>
      </Header>
    </Box>
  )
}

export default Home
