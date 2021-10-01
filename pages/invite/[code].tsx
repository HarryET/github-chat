import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Text, ButtonDanger, ButtonPrimary, BranchName } from '@primer/components'
import { supabase } from '../_app';
import Header from "../../components/header";

const JoinInvite: NextPage = () => {
  const router = useRouter();
  const { code } = router.query

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  if (typeof window !== "undefined") {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/invite/${code}`);
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
     <Header showAvatar={true} />
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
