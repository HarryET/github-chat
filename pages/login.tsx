import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  ButtonPrimary,
  Flash,
  Spinner,
  StyledOcticon,
  Text,
} from "@primer/components";
import { MarkGithubIcon, XIcon } from "@primer/octicons-react";
import { useMutation } from "react-query";
import { MainActionBox } from "components/MainActionBox";
import { Root } from "components/Root";
import { supabase } from "service/supabase";

const Login: NextPage = () => {
  const router = useRouter();

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

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

  if (typeof window !== "undefined") {
    if (isAuthenticated) {
      router.push("/");
      return null;
    }
  }

  return (
    <Root>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <MainActionBox>
          <StyledOcticon icon={MarkGithubIcon} size="large" />
          <Text as="h1" mt={4} mb={0} lineHeight={1}>
            Github Chat
          </Text>
          {error && (
            <Flash variant="danger" mt={5} sx={{ width: "100%" }}>
              <StyledOcticon icon={XIcon} />
              {(error as Error)?.message || "Failed to login"}
            </Flash>
          )}
          <ButtonPrimary
            mt={6}
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
        </MainActionBox>
      </Box>
    </Root>
  );
};

export default Login;
