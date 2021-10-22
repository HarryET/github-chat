import { Text, Link, BranchName } from "@primer/components"
import NextLink from "next/link";
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

    let lineBreakCount = 0;
    let mdContent = reactStringReplace(content, "\n", () => <br key={`line-break-${lineBreakCount++}`} />);

    const fetchMentionData = async (id: string) => {
        const { data: userData } = await supabase
            .from<User>("users")
            .select(`id,
            username, 
            avatar_url`)
            .limit(1)
            .eq("id", id)

        if ((userData ?? []).length > 0) {
            const user: User | null = userData ? userData[0] : null;
            if (user) {
                setMentionsData(prevState => {
                    return  {
                        ...prevState,
                        [user.id]: user
                    }
                })
            }
        }
    }

    // Add mentions
    let mentionsCount = 0;
    mdContent = reactStringReplace(mdContent, /<@([A-Za-z0-9\-]+)>/gmi, (match) => {
        const userId = match.replace("<@", "").replace(">", "");

        const user = mentionsData[userId];
        if (user) {
            return (<BranchName key={`mention-${mentionsCount++}`} href={`https://github.com/${user.username}`}>
                @{user.username}
            </BranchName>);
        } else {
            fetchMentionData(userId);
            return (<BranchName key={`mention-${mentionsCount++}`}>
                @{userId}
            </BranchName>);
        }
    })

    // Add bold content
    let boldCount = 0;
    mdContent = reactStringReplace(mdContent, /\*\*(.+)\*\*/gmi, (match) => {
        const boldContent = match.replace("**", "");
        return (<Text key={`bold-${boldCount++}`} fontWeight={"bold"}>{boldContent}</Text>)
    })

    // Add underlined content
    let underlinedCount = 0;
    mdContent = reactStringReplace(mdContent, /\_\_(.+)\_\_/gmi, (match) => {
        const boldContent = match.replace("**", "");
        return (<Text key={`ul-${underlinedCount++}`} style={{
            textDecoration: "underline"
        }}>{boldContent}</Text>)
    })

    // Add inline code content
    let inlineCodeCount = 0;
    mdContent = reactStringReplace(mdContent, /`(.+)`/gmi, (match) => {
        const codeContent = match.replace("`", "");
        return (<BranchName key={`inline-code-${inlineCodeCount++}`}>{codeContent}</BranchName>)
    })

    // Add links for urls
    let linkCount = 0;
    mdContent = reactStringReplace(mdContent, /(https?:\/\/\S+)/gmi, (match) => {
        return (<NextLink key={`link-${linkCount++}`} href={`/redirect?url=${match}&back=${window.location}`}>
            <Link style={{ cursor: "pointer" }}>
                {match}
            </Link>
        </NextLink>)
    })

    return (<Twemoji options={{ className: "emoji" }}>
        {mdContent}
    </Twemoji>);
}