import { Avatar, ButtonOutline, Header, Text, Box } from "@primer/components";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "service/supabase";

type HeaderProps = {
  showAvatar: boolean;
};

export const CustomHeader = ({ showAvatar }: HeaderProps) => {
  const router = useRouter();

  const session = supabase.auth.session();
  const user = session?.user;
  const userMeta = user?.user_metadata;

  const [isAuthenticated, setIsAuthenticated] = useState(session !== null);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/octocat.png");

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event == "SIGNED_IN" || event == "USER_UPDATED") {
      setAvatarUrl(session?.user?.user_metadata.avatar_url);
      setIsAuthenticated(true);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      setAvatarUrl(userMeta?.avatar_url);
    }
  }, [isAuthenticated, userMeta?.avatar_url]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push(`/`);
    }
  };

  return (
    <Header>
      <Header.Item>
        <Link href="/" passHref>
          <Header.Link fontSize={2}>
            <span>GitHub Chat</span>
          </Header.Link>
        </Link>
      </Header.Item>
      <Header.Item full></Header.Item>
      {isAuthenticated && (
        <ButtonOutline marginRight={2} variant="small" onClick={handleLogout}>
          Logout
        </ButtonOutline>
      )}
      {showAvatar && isAuthenticated && (
        <Header.Item mr={0}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar
              //TODO: Fallback avatar src
              src={avatarUrl || ""}
              size={32}
              square
              alt={userMeta?.user_name}
            />
            <Text fontWeight="bold" paddingLeft={2}>
              {userMeta?.user_name}
            </Text>
          </Box>
        </Header.Item>
      )}
      {showAvatar && !isAuthenticated && (
        <ButtonOutline variant="small" onClick={() => router.push("/login")}>
          Login
        </ButtonOutline>
      )}
    </Header>
  );
};
