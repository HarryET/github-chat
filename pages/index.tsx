import type { NextPage } from "next";
import { Box } from "@primer/components";
import { SideMenu } from "../components/SideMenu";
import { Root } from "../components/Root";
import { supabase } from "service/supabase";
import Discover from "components/Discover";

const Home: NextPage = () => {
  const session = supabase.auth.session();
  const isAuthenticated = session !== null;

  if (!isAuthenticated) {
    return (
      <Root fixedScreenHeight={false}>
        <Discover></Discover>
      </Root>
    );
  }

  return (
    <Root fixedScreenHeight={true}>
      <Box bg="canvas.default" flexGrow={1} display="flex" flexDirection="row" height="100%">
        <SideMenu />
      </Box>
    </Root>
  );
};

export default Home;
