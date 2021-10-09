import { NextPage } from "next";
import { useRouter } from "next/router";
import {
    Box,
    Text,
    ButtonPrimary,
    BranchName,
    ButtonOutline,
} from "@primer/components";
import { MainActionBox } from "../components/MainActionBox";
import { Root } from "../components/Root";
import { useEffect } from "react";

const Redirect: NextPage = () => {
    const router = useRouter();
    const { url: redirectTo, back } = router.query;

    useEffect(() => {
        if(!redirectTo) {
            if(!back) {
                router.push("https://github-chat.com")
            } else {
                router.push(back as string)
            }
        }
    }, [])

    return (
        <Root>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
            >
                <MainActionBox>
                    <Text as="h1" m={0} lineHeight={1}>
                        Redirect
                    </Text>
                    <Text mt={5} textAlign="center">
                        You are being redirected to{" "}
                        <BranchName>{redirectTo}</BranchName>
                    </Text>

                    <ButtonPrimary
                        mt={5}
                        variant="large"
                        width="100%"
                        onClick={() => {
                            const url = redirectTo ? redirectTo as string : "https://github-chat.com";
                            router.push(url);
                        }}
                    >
                        Continue
                    </ButtonPrimary>
                    <ButtonOutline mt={3} variant="large" width="100%" onClick={() => {
                        const url = back ? back as string : "https://github-chat.com";
                        router.push(url);
                    }}>
                        Go Back
                    </ButtonOutline>
                </MainActionBox>
            </Box>
        </Root>
    );
}

export default Redirect;