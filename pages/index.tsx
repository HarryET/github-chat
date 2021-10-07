import type { NextPage } from "next";
import { Box } from "@primer/components";
import { useRouter } from "next/dist/client/router";
import { Message } from "../components/Message";
import { SideMenu } from "../components/SideMenu";
import { Root } from "../components/Root";
import { supabase } from "service/supabase";

const Home: NextPage = () => {
  const router = useRouter();

  const session = supabase.auth.session();
  const isAuthenticated = session !== null;
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push(`/login?redirect=/`);
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Root>
      <Box
        bg="canvas.default"
        flexGrow={1}
        display="flex"
        flexDirection="row"
        height="100%"
      >
        <SideMenu />
        <Box flexGrow={1} height="100%">
          <h3>Your Feed:</h3>
          <Box padding={4}>
            <Message
              avatar="https://avatars.githubusercontent.com/u/29015545?v=4"
              username="HarryET"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/10214025?v=4"
              username="kiwicopple"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/4266663?v=4"
              username="SebLague"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/458736?v=4"
              username="awalias"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
            <Message
              avatar="https://avatars.githubusercontent.com/u/18113850?v=4"
              username="dshukertjr"
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at."
            />
          </Box>
        </Box>
      </Box>
    </Root>
  );
};

export default Home;
