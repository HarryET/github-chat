import { useRouter } from "next/router";
import { Root } from "components/Root";
import { SideMenu } from "components/SideMenu";
import { useQuery } from "react-query";
import { bannerUrl, userById } from "service/supabase";
import { Box, Text, Spinner, Button, Avatar } from "@primer/components";
import { StopIcon, SyncIcon, PaperAirplaneIcon } from "@primer/octicons-react";
import React, { useEffect } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import { Markdown } from "components/Markdown";
import { getFlagComponent, getUserFlags } from "service/flags";
import Twemoji from "react-twemoji";
import { countryCodeEmoji } from "country-code-emoji";

export const getServerSideProps = ({ params }: GetServerSidePropsContext<{ id: string }>): GetServerSidePropsResult<{ id: string | undefined }> => {
    const id: string | undefined = (params || {}).id;

    return {
        props: {
            id: id
        },
    };
}

const UserProfile = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await refetchUser();
        })()
    }, [id])

    const {
        data: user,
        error: userError,
        isLoading: isUserLoading,
        refetch: refetchUser,
    } = useQuery(
        [`user-${id}`],
        async () => {
            const { data, error } = await userById(id!);

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
                                            Something went wrong trying to load this profile.
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
                                            {"Why don't you tell them about Github Chat?"}
                                        </Text>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                    {user != null && <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                        <Box backgroundColor={user.banner_colour} backgroundImage={`url("${bannerUrl(user)}")`} backgroundPosition={"center"} height={"250px"} width={"100%"} borderRadius={15} />
                        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start" ml={5}>
                            <Avatar src={user.avatar_url} square size={84} mt={-21} />
                            <Box display="flex" marginLeft={4} flexDirection="column" justifyContent="start" alignItems="start">
                                <Box display="flex" flexDirection="row" justifyContent="start" alignItems="baseline">
                                    <Text as={"h2"} fontSize={"extra-large"} margin={0}>{user.display_name ?? user.username}</Text>
                                    {user.country && <Text ml={2}>
                                        <Twemoji options={{ className: "emoji-medium" }}>
                                            {countryCodeEmoji(user.country)}
                                        </Twemoji>
                                    </Text>}
                                </Box>
                                {user.bio && <Box color={"fg.muted"}><Markdown content={user.bio} /></Box>}
                                {user.flags != 0 && <Text as={"h4"} fontSize={"large"} margin={0} mt={3}>Badges</Text>}
                                {user.flags != 0 && <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
                                    <Twemoji options={{ className: "emoji" }}>
                                        {getUserFlags(user).map((flag) => getFlagComponent(flag, flag.valueOf(), "xl"))}
                                    </Twemoji>
                                </Box>}
                            </Box>
                        </Box>
                    </Box>}
                </Box>
            </Box>
        </Root>
    );
}

export default UserProfile;