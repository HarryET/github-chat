import { Link, Text } from "@primer/components";
import { ComponentProps } from "react";

export const PersonalLinks = (props: ComponentProps<typeof Text>) => (
    <Text fontSize={1} color="fg.subtle" mb={2} {...props}>
        A project by{" "}
        <Link href="https://twitter.com/TheHarryET" target="_blank">
            Harry
        </Link>
        ,{" "}
        <Link href="https://twitter.com/_hugocardenas" target="_blank">
            Hugo
        </Link>{" "}
        &{" "}
        <Link href="https://twitter.com/PeraltaDev" target="_blank">
            Victor
        </Link>
        .
    </Text>
);