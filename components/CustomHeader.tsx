import { Avatar, ButtonOutline, Header, Text, Box, StyledOcticon, ButtonInvisible } from "@primer/components";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "service/supabase";
import Image from "next/image";
import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";
import { SideMenu } from "./SideMenu";
import { useQuery } from "react-query";
import { User } from "types";

export const CustomHeader = () => {
  const router = useRouter();

  const chatId = typeof router.query?.chatId === "string" ? router.query?.chatId : undefined;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/octocat.png");
  const [username, setUsername] = useState("Octocat");
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | undefined | null>();

  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const session = supabase.auth.session();
    const user = session?.user;
    const userMeta = user?.user_metadata;

    setSupabaseUser(user);

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

      const user = session?.user;
      setAvatarUrl(user?.user_metadata.avatar_url);
      setUsername(user?.user_metadata.user_name);
      setSupabaseUser(user);
    }

    // Not authenticated
    if (event == "SIGNED_OUT" || event == "USER_DELETED") {
      setIsAuthenticated(false);
      setUsername("Octocat");
      setAvatarUrl("https://github.com/octocat.png");
      setSupabaseUser(null);
    }
  });

  const { data: chat } = useQuery(
    ["chats", chatId],
    async () => {
      type Chat = { id: string; repo_owner: string; repo_name: string };
      if (chatId) {
        const { data: chat, error } = await supabase.from<Chat>("chats").select().eq("id", chatId).single();
        if (error) {
          throw error;
        }
        return chat;
      }
    },
    { enabled: !!chatId }
  );

  const { data: user } = useQuery(
    ["user-me"],
    async () => {
      if (!!supabaseUser) {
        const { data: user, error } = await supabase.from<User>("users").select().eq("id", supabaseUser?.id).single();
        if (error) {
          throw error;
        }
        return user;
      }
    },
    { enabled: isAuthenticated && !!supabaseUser }
  );

  // TODO Handle error
  const handleLogout = () => supabase.auth.signOut();

  const handleMenuClick = () => {
    setMenuOpen((previous) => !previous);
  };

  return (
    <Header sx={{ height: "64px" }} display="flex">
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
      <Header.Item full display="flex" sx={{ justifyContent: "center" }}>
        {chat && <Text>{`${chat.repo_owner}/${chat.repo_name}`}</Text>}
      </Header.Item>

      {isAuthenticated && !!user && (
        <>
          <ButtonOutline
            marginRight={2}
            variant="small"
            height="100%"
            display={["none", "none", "block"]}
            onClick={() => {
              router.push("/settings")
            }}
          >
            Settings
          </ButtonOutline>
          <ButtonOutline
            marginRight={2}
            variant="small"
            height="100%"
            display={["none", "none", "block"]}
            onClick={handleLogout}
          >
            Logout
          </ButtonOutline>
          <Header.Item mr={0} display={["none", "none", "block"]}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar
                //TODO: Fallback avatar src
                src={avatarUrl || ""}
                size={32}
                square
                alt={username}
              />
            </Box>
          </Header.Item>
          <ButtonInvisible display={["flex", "flex", "none"]} paddingX={2} ml={2} onClick={handleMenuClick}>
            <StyledOcticon icon={isMenuOpen ? XIcon : ThreeBarsIcon} color="fg.default" />
          </ButtonInvisible>
        </>
      )}
      {!isAuthenticated && (
        <ButtonOutline variant="small" onClick={() => router.push("/login")}>
          Login
        </ButtonOutline>
      )}
      {isMenuOpen && (
        <Box
          position="absolute"
          top="64px"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          flexDirection="column"
          alignItems="center"
          background="rgb(13, 17, 23, 0.95)"
          overflowY="auto"
        >
          <SideMenu router={router} onSelect={() => setMenuOpen(false)} />
        </Box>
      )}
    </Header>
  );
};
