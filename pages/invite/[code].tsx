import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  ButtonDanger,
  ButtonPrimary,
  BranchName,
  ButtonInvisible,
  ButtonOutline,
} from "@primer/components";
import { supabase } from "../_app";
import Header from "../../components/header";
import { MainActionBox } from "../../components/MainActionBox";

const JoinInvite: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/invite/${code}`);
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header showAvatar={true} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <MainActionBox>
          <Text as="h1" m={0} lineHeight={1}>
            Join chat
          </Text>
          <Text mt={5} textAlign="center">
            Do you accept the invitation to{" "}
            <BranchName>{"Author/RepoName"}</BranchName> ?
          </Text>

          <ButtonPrimary
            mt={5}
            // TODO
            // disabled={isLoading}
            variant="large"
            width="100%"
            // TODO
            // onClick={() => handleSignIn()}
          >
            Accept
          </ButtonPrimary>
          <ButtonOutline mt={3} variant="large" width="100%">
            Cancel
          </ButtonOutline>
        </MainActionBox>
      </Box>
    </Box>
  );
};

export default JoinInvite;
