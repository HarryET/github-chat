import type { NextPage } from 'next'
import { Header, ButtonOutline, Avatar } from '@primer/components'
import { supabase } from './_app';

const Home: NextPage = () => {
  const session = supabase.auth.session();
  const isAuthenticated = session != null

  return (
    <div>
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={2}>
            <span>GitHub Chat</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>
        </Header.Item>
        <Header.Item mr={0}>
          {isAuthenticated && <Avatar src="https://github.com/octocat.png" size={32} square alt="@octocat" /> }
          {!isAuthenticated && <ButtonOutline variant="small" >Login</ButtonOutline> }
        </Header.Item>
      </Header>
    </div>
  )
}

export default Home
