import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, ButtonPrimary } from '@primer/components'
import { MarkGithubIcon } from '@primer/octicons-react'
import { supabase } from './_app';
import Header from '../components/header';

const Home: NextPage = () => {
  const router = useRouter()

  const session = supabase.auth.session();
  const isAuthenticated = session != null

  if(typeof window !== "undefined") {
    if (isAuthenticated) {
      router.push("/");
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header showAvatar={false} />
      <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height="100%" width="100%">
        <ButtonPrimary marginTop={5} onClick={async () => {
          const { error } = await supabase.auth.signIn({
            provider: "github",
          }, {
            scopes: "read:org,read:user,user:email"
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
