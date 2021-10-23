import { useRouter } from "next/router";
import { Root } from "components/Root";
import { SideMenu } from "components/SideMenu";
import { useQuery } from "react-query";
import { userByUsername } from "service/supabase";
import { Box, Text, Spinner, Button, Avatar } from "@primer/components";
import { StopIcon, SyncIcon, PaperAirplaneIcon } from "@primer/octicons-react";
import React, { useEffect } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import { Markdown } from "components/Markdown";
import { getFlagComponent, getUserFlags } from "service/flags";
import Twemoji from "react-twemoji";

export const getServerSideProps = ({ params }: GetServerSidePropsContext<{ username: string }>): GetServerSidePropsResult<{ username: string | undefined }> => {
    const username: string | undefined = (params || {}).username;

    return {
        props: {
            username: username
        },
    };
}

const UserProfile = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await refetchUser();
        })()
    }, [username])

    const {
        data: user,
        error: userError,
        isLoading: isUserLoading,
        refetch: refetchUser,
    } = useQuery(
        ["user"],
        async () => {
            const { data, error } = await userByUsername(username!);

            if (error) {
                throw error;
            }

            if (data == null) {
                return undefined;
            }

            if (data.length <= 0) {
                return undefined;
            }

            if (data[0]) {
                return data[0]
            }

            return undefined;
        },
        { enabled: true, staleTime: Infinity }
    );

    return (
        <Root fixedScreenHeight={true}>
            <Box flexGrow={1} display="flex" flexDirection="row" overflow="hidden">
                <SideMenu router={router} display={["none", "none", "flex"]} />
                <Box
                    height="100%"
                    maxHeight="100%"
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    px={4}
                    py={4}
                    overflowY="auto"
                >
                    {(isUserLoading || !!userError || !user) && (
                        <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400}>
                                {/* Loading */}
                                {isUserLoading && !user && (
                                    <>
                                        <Spinner margin={2} size="medium" />
                                        <Text>Loading profile...</Text>
                                    </>
                                )}
                                {/* Error fetching messages */}
                                {!!userError && !isUserLoading && (
                                    <>
                                        <StopIcon size="medium" />
                                        <Text mt={2} textAlign="center">
                                            Something went wrong trying to load {username}&#39;s profile.
                                        </Text>
                                        <Button mt={3} onClick={() => refetchUser()}>
                                            <SyncIcon size="small" />
                                            <Text ml={2}>Retry</Text>
                                        </Button>
                                    </>
                                )}
                                {!isUserLoading && !user && (
                                    <>
                                        <PaperAirplaneIcon size="medium" />
                                        <Text mt={2} textAlign="center">
                                            {"Sorry, that user hasn't joined us yet."} <br />
                                            {"Why dont't you tell them about Github Chat?"}
                                        </Text>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                    {user != null && <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
                        <Avatar src={user.avatar_url} square size={84} />
                        <Box display="flex" marginLeft={4} flexDirection="column" justifyContent="start" alignItems="start">
                            <Text as={"h2"} fontSize={"extra-large"} margin={0}>{user.display_name ?? user.username}</Text>
                            {user.bio && <Markdown content={user.bio} />}
                            {user.flags != 0 && <Text as={"h4"} fontSize={"large"} margin={0} mt={2.5}>Badges</Text>}
                            {user.flags != 0 && <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
                                <Twemoji options={{ className: "emoji" }}>
                                    {getUserFlags(user).map((flag) => getFlagComponent(flag, flag.valueOf()))}
                                </Twemoji>
                            </Box>}
                        </Box>
                    </Box>}
                </Box>
            </Box>
        </Root>
    );
}

export default UserProfile;