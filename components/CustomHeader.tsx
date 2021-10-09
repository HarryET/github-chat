import { Avatar, ButtonOutline, Header, Text, Box } from "@primer/components";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "service/supabase";
import Image from "next/image";

type HeaderProps = {
  showAvatar: boolean;
};

export const CustomHeader = ({ showAvatar }: HeaderProps) => {
  const router = useRouter();

  const session = supabase.auth.session();
  const user = session?.user;
  const userMeta = user?.user_metadata;

  const isAuthenticated = !!session;

  const [avatarUrl, setAvatarUrl] = useState("https://github.com/octocat.png");

  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event == "SIGNED_IN" || event == "USER_UPDATED") {
      setAvatarUrl(session?.user?.user_metadata.avatar_url);
    }
  });

  // TODO Handle error
  const handleLogout = () => supabase.auth.signOut();

  return (
    <Header>
      <Header.Item>
        <Link href="/" passHref>
          <Header.Link>
            <Image src="/icon.svg" height={30} width={30} alt="GithHub Chat logo" />
            <Text ml={2} fontSize={3} fontWeight={600} letterSpacing={0.5}>
              github·chat
            </Text>
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
