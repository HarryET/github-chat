import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Header, Box, ButtonPrimary } from '@primer/components'
import { MarkGithubIcon } from '@primer/octicons-react'
import { supabase } from './_app';

const Home: NextPage = () => {
  const router = useRouter()

  const session = supabase.auth.session();
  const isAuthenticated = session != null

  if (isAuthenticated) {
    router.push("/");
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header>
        <Header.Item>
          <Header.Link href="#" fontSize={2}>
            <span>GitHub Chat</span>
          </Header.Link>
        </Header.Item>
      </Header>
      <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height="100%" width="100%">
        <ButtonPrimary marginTop={5} onClick={async () => {
          const { error } = await supabase.auth.signIn({
            provider: "github",
          });

          if(error) {
            console.error(error)
            return;
          }

          router.push("/");
        }}>
          <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" height="100%" width="100%">
            <MarkGithubIcon size={24} />
            <Box marginLeft={2}>
              <span>Login with GitHub</span>
            </Box>
          </Box>
        </ButtonPrimary>
      </Box>
    </Box>
  )
}

export default Home
