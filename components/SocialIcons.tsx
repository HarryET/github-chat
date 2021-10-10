import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { ComponentProps } from "react";
import { Box } from "@primer/components";
import NextLink from "next/link";

export const SocialIcons = (props: ComponentProps<typeof Box>) => (
    <Box display="flex" flexDirection="row" {...props}>
        <NextLink href={"https://github.com/HarryET/github-chat"}>
            <Box>
                <FontAwesomeIcon icon={faGithub} size={"sm"} color={"white"} />
            </Box>
        </NextLink>
        <NextLink href={"https://twitter.com/GithubChat"}>
            <Box ml={2}>
                <FontAwesomeIcon icon={faTwitter} size={"sm"} color={"white"} />
            </Box>
        </NextLink>
        <NextLink href={"/discord"}>
            <Box ml={2}>
                <FontAwesomeIcon icon={faDiscord} size={"sm"} color={"white"} />
            </Box>
        </NextLink>
    </Box>
);