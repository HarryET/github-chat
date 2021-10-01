import type { NextPage } from 'next'
import { Box, SideNav, Text } from '@primer/components'
import { supabase } from './_app';
import { useRouter } from 'next/dist/client/router';
import Message from "../components/message";
import Header from "../components/header";

const Home: NextPage = () => {
  const router = useRouter();

  const session = supabase.auth.session()
  const userMeta = session?.user?.user_metadata;

  return (
    <Box>
      <Header showAvatar={true} />
      <Box bg="bg.primary" display="flex" flexDirection="row" alignItems="start" justifyContent="center" height="100%">
        <Box width="25%" height="100%" padding={4}>
          <SideNav bordered maxWidth={360} aria-label="Main">
            <SideNav.Link href="/repo/HarryET/Repo1">
              <Text>HarryET/Repo1</Text>
            </SideNav.Link>
            <SideNav.Link href="/repo/HarryET/Repo2">
              <Text>HarryET/Repo2</Text>
            </SideNav.Link>
            <SideNav.Link href="/repo/HarryET/Repo3">
              <Text>HarryET/Repo3</Text>
            </SideNav.Link>
            <SideNav.Link href="/repo/HarryET/Repo4">
              <Text>HarryET/Repo4</Text>
            </SideNav.Link>
          </SideNav>
        </Box>
        <Box width="75%" height="100%" >
          <h3>Your Feed:</h3>
          <Box width="100%" padding={4}>
            <Message avatar="https://avatars.githubusercontent.com/u/29015545?v=4" username="HarryET" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at." />
            <Message avatar="https://avatars.githubusercontent.com/u/10214025?v=4" username="kiwicopple" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at." />
            <Message avatar="https://avatars.githubusercontent.com/u/4266663?v=4" username="SebLague" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at." />
            <Message avatar="https://avatars.githubusercontent.com/u/458736?v=4" username="awalias" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at." />
            <Message avatar="https://avatars.githubusercontent.com/u/18113850?v=4" username="dshukertjr" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget congue nisl. Maecenas vulputate mollis facilisis. Nullam fermentum eu diam id blandit. Suspendisse non nulla at quam hendrerit vulputate non ac mi. Cras quis pharetra diam. Sed pretium, enim quis gravida iaculis, est odio consequat lectus, a maximus nisi dolor non arcu. Suspendisse potenti. Mauris convallis auctor sem, sed ultrices magna vestibulum ut. Etiam aliquet tortor et ante iaculis congue. Nunc ac ante vehicula tortor porttitor lacinia. Sed porta auctor hendrerit. Curabitur non lectus nunc. Donec a elementum urna. Nunc viverra orci nibh, sed pharetra mauris cursus at." />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
