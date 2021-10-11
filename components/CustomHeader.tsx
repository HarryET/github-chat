import { Avatar, ButtonOutline, Header, Text, Box } from "@primer/components";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "service/supabase";
import Image from "next/image";

export const CustomHeader = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/octocat.png");
  const [username, setUsername] = useState("Octocat");

  useEffect(() => {
    const session = supabase.auth.session();
    const user = session?.user;
    const userMeta = user?.user_metadata;

    setIsAuthenticated(!!session);
    if (!!session) {
      setUsername(userMeta?.user_name ?? "Octocat");
      setAvatarUrl(userMeta?.avatar_url ?? "https://github.com/octocat.png");
    }
  }, []);

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    // Authenticated
    if (event == "SIGNED_IN" || event == "USER_UPDATED") {
      setIsAuthenticated(true);
      setAvatarUrl(session?.user?.user_metadata.avatar_url);
      setUsername(session?.user?.user_metadata.user_name);
    }

    // Not authenticated
    if (event == "SIGNED_OUT" || event == "USER_DELETED") {
      setIsAuthenticated(false);
      setUsername("Octocat");
      setAvatarUrl("https://github.com/octocat.png");
    }
  });

  // TODO Handle error
  const handleLogout = () => supabase.auth.signOut();

  return (
    <Header>
      <Header.Item>
        <Link href="/" passHref>
          <Header.Link>
            <Image src="/icon.svg" height={24} width={24} alt="GithHub Chat logo" />
            {router.pathname === "/" && (
              <Text ml={2} fontSize={3} fontWeight={600} letterSpacing={0.5} display={["none", "none", "block"]}>
                github·chat
              </Text>
            )}
          </Header.Link>
        </Link>
      </Header.Item>
      <Header.Item full></Header.Item>
      {isAuthenticated && (
        <ButtonOutline marginRight={2} variant="small" height="100%" onClick={handleLogout}>
          Logout
        </ButtonOutline>
      )}
      {isAuthenticated && (
        <Header.Item mr={0} display={["none", "none", "block"]}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar
              //TODO: Fallback avatar src
              src={avatarUrl || ""}
              size={32}
              square
              alt={username}
            />
            {/* <Text fontWeight="bold" paddingLeft={2}>
              {username}
            </Text> */}
          </Box>
        </Header.Item>
      )}
      {!isAuthenticated && (
        <ButtonOutline variant="small" onClick={() => router.push("/login")}>
          Login
        </ButtonOutline>
      )}
    </Header>
  );
};
