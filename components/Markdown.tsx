import { Text, Link, BranchName } from "@primer/components"
import NextLink from "next/link";
// @ts-ignore
import Twemoji from "react-twemoji";
import { User } from 'types';
import React, { useState, useEffect } from 'react';
import reactStringReplace from 'react-string-replace';
import { supabase } from 'service/supabase';

type MarkdownProps = {
    content: string;
}

export const Markdown = ({ content }: MarkdownProps) => {
    // Stores a link between userid and username
    const [mentionsData, setMentionsData] = useState<Record<string, User>>({});

    let mdContent = reactStringReplace(content, "\n", () => <br />);

    useEffect(() => {
        const rawRegexMatches = content.matchAll(/<@([A-Za-z0-9\-]+)>/gmi);
        const rawMatches: string[] = []; for (const row of rawRegexMatches) for (const e of row) rawMatches.push(e);
        rawMatches.forEach(async (rawId) => {
            const id = rawId.replace("<@", "").replace(">", "");
            console.log(rawId, id);
            const { data: userData } = await supabase
                .from<User>("users")
                .select(`id,
            username, 
            avatar_url`)
                .limit(1)
                .eq("id", id)

            if ((userData ?? []).length > 0) {
                const user: User = userData![0]!;
                setMentionsData({
                    ...mentionsData,
                    [user.id]: user
                });
            }
        })
    }, [])

    // Add mentions
    mdContent = reactStringReplace(mdContent, /<@([A-Za-z0-9\-]+)>/gmi, (match) => {
        const userId = match.replace("<@", "").replace(">", "");

        const user = mentionsData[userId];
        if (user) {
            return (<BranchName href={`https://github.com/${user.username}`}>
                @{user.username}
            </BranchName>);
        } else {
            return (<BranchName>
                @{userId}
            </BranchName>);
        }
    })

    // Add bold content
    mdContent = reactStringReplace(mdContent, /\*\*(.+)\*\*/gmi, (match) => {
        const boldContent = match.replace("**", "");
        return (<Text fontWeight={"bold"}>{boldContent}</Text>)
    })

    // Add underlined content
    mdContent = reactStringReplace(mdContent, /\_\_(.+)\_\_/gmi, (match) => {
        const boldContent = match.replace("**", "");
        return (<Text style={{
            textDecoration: "underline"
        }}>{boldContent}</Text>)
    })

    // Add links for urls
    mdContent = reactStringReplace(mdContent, /(https?:\/\/\S+)/gmi, (match) => {
        return (<NextLink href={`/redirect?url=${match}&back=${window.location}`}>
            <Link style={{ cursor: "pointer" }}>
                {match}
            </Link>
        </NextLink>)
    })

    return (<Twemoji className={"emoji"}>
        {mdContent}
    </Twemoji>);
}