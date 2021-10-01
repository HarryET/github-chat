import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Text, ButtonDanger, ButtonPrimary, Avatar, TextInput, Dropdown } from '@primer/components'
import { supabase } from '../_app';
import Header from "../../components/header";
import { SetStateAction, useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';

const NewChat: NextPage = () => {
  const router = useRouter();
  const { code } = router.query

  const session = supabase.auth.session();
  const isAuthenticated = session != null;

  const userMeta = session?.user?.user_metadata;

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const createNewChat = async () => {
    const octokit = new Octokit({
      auth: session?.provider_token!
    })

    try {
      const repoData = await octokit.rest.repos.get({
        owner: owner,
        repo: repo
      });

      if(!repoData.data.permissions?.admin) {
        // TODO handle not admin.
        console.log("Not admin!")
        return;
      }

      const { data: existingChat, error: existingChatError } = await supabase
        .from("chats")
        .select()
        .eq("github_repo_id", repoData.data.id);

      if(existingChatError) {
        // TODO handle error
        console.log("Exists error!")
        return;
      }

      if((existingChat ?? []).length > 0) {
        // TODO handle already exists
        console.log("Already exists")
        return;
      }

      const {data, error} = await supabase
        .from("chats")
        .insert([
          {github_repo_id: repoData.data.id, owner_id: session?.user?.id}
        ]);

      if(error || data == null) {
        // TODO handle error
        return;
      }

      router.push(`/chats/${data[0].id}`)
    } catch (e) {
      // TODO handle error
      return;
    }

    //console.log(repos.data.filter((r) => !r.fork && !r.private && !r.archived));
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/chat/new`);
        return;
      }
    }
  }, [isAuthenticated, router])

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Header showAvatar={true} />
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="100%">
        <Box>
          <h3>Create a new Chat!</h3>
          <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="start">
              <Box mb={2}>
                <Text>Owner</Text>
              </Box>
              <TextInput aria-label="Owner" name="owner" onChange={(e: { target: { value: SetStateAction<string>; }; }) => setOwner(e.target.value)} />
            </Box>
            <Box marginX={4}>
              <Text fontWeight="bold" fontSize={3}>/</Text>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="start">
              <Box mb={2}>
                <Text>Repository</Text>
              </Box>
              <TextInput aria-label="Repo" name="repo" onChange={(e: { target: { value: SetStateAction<string>; }; }) => setRepo(e.target.value)} />
            </Box>
          </Box>
          <ButtonPrimary marginTop={3} onClick={createNewChat}>
            Create Chat
          </ButtonPrimary>
        </Box>
      </Box>
    </Box>
  )
}

export default NewChat;
