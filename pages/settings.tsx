import type { InferGetStaticPropsType } from "next";
import { Box, Text, ButtonPrimary, TextInput, Button, StyledOcticon } from "@primer/components";
import { SideMenu } from "../components/SideMenu";
import { Root } from "../components/Root";
import { supabase } from "service/supabase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Session } from "@supabase/gotrue-js";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { PersonalLinks } from "components/PersonalLinks";
import { SocialIcons } from "components/SocialIcons";
import { useQuery } from "react-query";
import { User } from "types";
import { FileIcon } from "@primer/octicons-react";

export const getStaticProps = async () => {
    return {
        props: {},
    };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Settings = ({ }: Props) => {
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const [bio, setBio] = useState<string | undefined>(undefined);
    const [banner, setBanner] = useState<string | undefined>(undefined);
    const [orignalValues, setOriginalValues] = useState<{ bio: string | undefined, displayName: string | undefined, banner: string | undefined }>({
        bio: undefined,
        displayName: undefined,
        banner: undefined
    });

    const {
        data: user,
        refetch: refetchUser,
    } = useQuery(
        ["me-user"],
        async () => {
            const { data, error } = await supabase
                .from<User>("users")
                .select()
                .eq("id", session!.user!.id!)
                .single()

            if (error) {
                throw error;
            }

            return data;
        },
        { enabled: isAuthenticated, staleTime: Infinity }
    );

    supabase.auth.onAuthStateChange((event: AuthChangeEvent, newSession: Session | null) => {
        // Authenticated
        if (event == "SIGNED_IN" || event == "USER_UPDATED") {
            setIsAuthenticated(true);
            refetchUser();
        }

        // Not authenticated
        if (event == "SIGNED_OUT" || event == "USER_DELETED") {
            setIsAuthenticated(false);
            router.push("/");
        }

        setSession(newSession);
    });

    useEffect(() => {
        const tempSession = supabase.auth.session();
        setIsAuthenticated(tempSession !== null);
        setSession(tempSession);
        if (tempSession == null) {
            router.push("/")
        }
    }, []);

    useEffect(() => {
        setDisplayName(user?.display_name);
        setBio(user?.bio);
        setBanner(user?.banner);
        setOriginalValues({
            bio: user?.bio,
            displayName: user?.display_name,
            banner: user?.banner
        });
    }, [user])

    const areNewValues = () => {
        return displayName?.trim() != orignalValues.displayName || bio?.trim() != orignalValues.bio;
    }

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
                    <SettingsItem title={"Display Name"} description={"This is the name used when sending messages and on your profile page."}>
                        <TextInput width="100%" aria-label="Display Name" name="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" autoComplete="display-name" />
                    </SettingsItem>
                    <SettingsItem title={"Bio"}>
                        <TextInput as="textarea" width="100%" rows={6} style={{ resize: "none" }} aria-label="Bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" autoComplete="bio" />
                    </SettingsItem>
                    <Box display="flex" flexDirection="row" alignItems="start" justifyContent="space-between" maxWidth="800px" mb={4}>
                        {/* Description / Title Area */}
                        <Box display="flex" flexDirection="column" alignItems="start" justifyContent="start" maxWidth="55%"></Box>
                        <Box maxWidth="40%" width="100%" display="flex" flexDirection="column" alignItems="end" justifyContent="end">
                            <ButtonPrimary width="100%" disabled={!areNewValues()} onClick={async () => {
                                const { data, error } = await supabase
                                    .from<User>("users")
                                    .update({
                                        bio: bio?.trim(),
                                        display_name: displayName?.trim()
                                    })
                                    .eq("id", session!.user!.id!)
                                    .single()

                                if (error) {
                                    // TODO handle in ui
                                    return;
                                }

                                refetchUser();
                            }}>Save Changes</ButtonPrimary>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" mt={4}>
                        <PersonalLinks />
                        <SocialIcons />
                    </Box>
                </Box>
            </Box>
        </Root>
    );
};

type SettingsItemProps = {
    title: string;
    description?: string;
}
const SettingsItem: React.FC<SettingsItemProps> = ({ title, description, children }) => {
    return (<Box display="flex" flexDirection="row" alignItems="start" justifyContent="space-between" maxWidth="800px" mb={4}>
        {/* Description / Title */}
        <Box display="flex" flexDirection="column" alignItems="start" justifyContent="start" maxWidth="55%">
            <Text as={"h5"} fontSize="large" margin={0} marginBottom={1}>{title}</Text>
            {description && <Text color="fg.muted">{description}</Text>}
        </Box>
        <Box maxWidth="40%" width="100%" display="flex" flexDirection="column" alignItems="end" justifyContent="end">
            {children}
        </Box>
    </Box>)
}

export default Settings;
