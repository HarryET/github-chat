import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Text, ButtonDanger, ButtonPrimary, BranchName } from '@primer/components'
import { supabase } from '../_app';
import Header from "../../components/header";

const ViewChat: NextPage = () => {
  const router = useRouter();
  const { chat } = router.query

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  if (typeof window !== "undefined") {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/`);
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
     <Header showAvatar={true} />
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="100%">
        <Text>Viewing chat - <BranchName>{chat}</BranchName></Text>
      </Box>
    </Box>
  )
}

export default ViewChat;
