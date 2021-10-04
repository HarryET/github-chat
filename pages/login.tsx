import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  ButtonPrimary,
  Flash,
  Spinner,
  StyledOcticon,
} from "@primer/components";
import { MarkGithubIcon, XIcon } from "@primer/octicons-react";
import { supabase } from "./_app";
import Header from "../components/header";
import { useMutation } from "react-query";

const Home: NextPage = () => {
  const router = useRouter();

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

  if (typeof window !== "undefined") {
    if (isAuthenticated) {
      router.push("/");
    }
  }

  const {
    mutate: handleSignIn,
    isLoading,
    error,
  } = useMutation(async () => {
    const { error } = await supabase.auth.signIn(
      { provider: "github" },
      { scopes: "read:org,read:user,user:email" }
    );

    if (error) {
      console.error(error);
      throw error;
    }

    router.push("/");
  });

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header showAvatar={false} />
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <MarkGithubIcon size="large" />
        {error && (
          <Flash variant="danger">
            <StyledOcticon icon={XIcon} />
            {(error as Error)?.message || "Failed to login"}
          </Flash>
        )}
        <ButtonPrimary
          marginTop={5}
          disabled={isLoading}
          variant="large"
          width={256}
          onClick={() => handleSignIn()}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            {isLoading && <Spinner size="small" />}
            <Box marginLeft={2}>
              <span>Login with GitHub</span>
            </Box>
          </Box>
        </ButtonPrimary>
      </Box>
    </Box>
  );
};

export default Home;
