import React, { FormEvent, KeyboardEvent, useState } from "react";
import { Box, ButtonPrimary, StyledOcticon, TextInput } from "@primer/components";
import { useMutation } from "react-query";
import { supabase } from "service/supabase";
import type { Mention, User as DBUser } from "../types";
import { User } from "@supabase/gotrue-js";
import { buttonGradient } from "styles/styles";
import { PaperAirplaneIcon } from "@primer/octicons-react";

type Props = {
  chatId: string;
  user: User;
};

export const MessageInput = ({ chatId, user }: Props) => {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    const lines = newValue.split(/\r\n|\r|\n/).length;
    if (lines > 1) {
      if (lines > 5) {
        setRows(5);
      } else {
        setRows(lines);
      }
    } else {
      setRows(1);
    }

    setValue(e.currentTarget.value);
  };

  const submit = () => {
    submitMessage();
    setValue("");
    setRows(1);
    localStorage.setItem("recent_chat", chatId);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey && value.trim().length > 0) {
      submit();
    }
  };

  // TODO Handle error
  const { mutate: submitMessage } = useMutation(async () => {
    const rawMentionRegexMatches: string[][] = Array.from(value.matchAll(/@[A-Za-z0-9\-]+/g)).map((regexMatchArray) => [
      ...regexMatchArray,
    ]);
    const rawMentions: string[] = [];
    for (const row of rawMentionRegexMatches) for (const e of row) rawMentions.push(e);

    const mentionsRaw: ({ username: string; id: string } | null)[] = await Promise.all(
      rawMentions.map(async (mention) => {
        const username = mention.substring(1);
        const { data: userData } = await supabase.from<DBUser>("users").select("id").eq("username", username);

        if ((userData ?? []).length > 0) {
          const user = userData![0];
          return { username: username, id: user.id } as Mention;
        }
        return null;
      })
    );

    const mentions = mentionsRaw.filter((mention): mention is Mention => mention != null);

    let mentionsValue = value;

    mentions.forEach((mention) => {
      mentionsValue = mentionsValue.replace(`@${mention.username}`, `<@${mention.id}>`);
    });

    const { error } = await supabase.from("messages").insert([
      {
        chat_id: chatId,
        user_id: user.id,
        content: mentionsValue,
        mentions: mentions.map((mention) => mention.id),
      },
    ]);

    if (error) {
      // TODO Handle in UI
      console.error(error);
    }
  });

  return (
    <Box display="flex" flexDirection="row" paddingX={3} paddingBottom={3} flexShrink={0}>
      <TextInput
        as="textarea"
        height="100%"
        width="100%"
        border="1px solid"
        borderColor="border.subtle"
        rows={rows}
        maxRows={5}
        sx={{
          "& > textarea": {
            fontSize: 2,
            lineHeight: 1.5,
          },
          minHeight: "48px",
          backgroundColor: "canvas.overlay",
          ":focus-within": {
            borderColor: "fg.subtle",
            boxShadow: "none",
          },
        }}
        style={{
          resize: "none",
        }}
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      <ButtonPrimary
        ml={2}
        display={["block", "block", "none"]}
        sx={{
          border: "none",
          background: buttonGradient.default,
          ":hover": {
            background: buttonGradient.hover,
          },
        }}
        onClick={submit}
      >
        <StyledOcticon icon={PaperAirplaneIcon} />
      </ButtonPrimary>
    </Box>
  );
};
