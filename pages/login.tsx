import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Flash, StyledOcticon, Text } from "@primer/components";
import { MarkGithubIcon, XIcon } from "@primer/octicons-react";
import { useMutation } from "react-query";
import { MainActionBox } from "components/MainActionBox";
import { Root } from "components/Root";
import { supabase } from "service/supabase";
import { useState } from "react";
import { LoginButton } from "components/LoginButton";
import Image from "next/image";

const Login: NextPage = () => {
  const router = useRouter();

  const redirectPath = typeof router.query.redirect === "string" ? router.query.redirect : "/";

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

  const [isLoading, setLoading] = useState(false);

  const { mutate: handleSignIn, error } = useMutation(
    async (redirectPath: string) => {
      setLoading(true);
      const { error } = await supabase.auth.signIn(
        { provider: "github" },
        {
          redirectTo: `${window.location.origin}${redirectPath}`,
          scopes: "read:org,read:user,user:email",
        }
      );

      if (error) {
        console.error(error);
        throw error;
      }
    },
    {
      onError: () => {
        setLoading(false);
      },
    }
  );

  if (typeof window !== "undefined") {
    if (isAuthenticated) {
      router.push("/");
      return null;
    }
  }

  return (
    <Root fixedScreenHeight={true}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        paddingX={[3, 4]}
      >
        <MainActionBox>
          <Image src="/icon.svg" height={64} width={64} alt="GithHub Chat logo" />
          <Text as="h1" mt={4} mb={0} lineHeight={1}>
            github·chat
          </Text>
          {error && (
            <Flash variant="danger" mt={5} sx={{ width: "100%" }}>
              <StyledOcticon icon={XIcon} />
              {(error as Error)?.message || "Failed to login"}
            </Flash>
          )}
          <LoginButton
            mt={6}
            disabled={isLoading}
            isLoading={isLoading}
            variant="large"
            width={256}
            onClick={() => handleSignIn(redirectPath)}
          />
        </MainActionBox>
      </Box>
    </Root>
  );
};

export default Login;
