import React, { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Box, Button, ButtonPrimary, StyledOcticon, TextInput } from "@primer/components";
import { useMutation } from "react-query";
import { supabase } from "service/supabase";
import type { Mention, User as DBUser } from "../types";
import { User } from "@supabase/gotrue-js";
import { buttonGradient } from "styles/styles";
import { FileIcon, PaperAirplaneIcon } from "@primer/octicons-react";
import { v4 as uuid } from "uuid";
type Props = {
  chatId: string;
  user: User;
};

export const MessageInput = ({ chatId, user }: Props) => {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);
  const inputFileRef = useRef<HTMLInputElement>(null);

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
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey && value.trim().length > 0) {
      e.preventDefault();
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

    // Remove line breaks from the beginning & end of the message
    const formattedContent = mentionsValue.replace(/^\n+/, "").replace(/\n+$/, "");

    const { error } = await supabase.from("messages").insert([
      {
        chat_id: chatId,
        user_id: user.id,
        content: formattedContent,
        mentions: mentions.map((mention) => mention.id),
      },
    ]);

    if (error) {
      // TODO Handle in UI
      console.error(error);
    }
  });

  const handleUploadFileButtonClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log("selected file?", selectedFile);

    if (selectedFile) {
      console.log("uploading");
      const storageKey = `uploads/${uuid()}`;
      const { data, error } = await supabase.storage.from("public").upload(storageKey, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });

      console.log(data, error);

      const { error: uploadError } = await supabase.from("messages").insert([
        {
          chat_id: chatId,
          user_id: user.id,
          content: data?.Key,
          file_name: selectedFile.name,
          type: 2,
        },
      ]);
    }
  };

  return (
    <Box display="flex" flexDirection="row" paddingX={[2, 2, 3]} paddingBottom={3} flexShrink={0}>
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
        onKeyPress={handleKeyPress}
      />
      <Button
        ml={2}
        sx={{
          border: "none",
          background: "fg.subtle",
        }}
        onClick={handleUploadFileButtonClick}
      >
        <StyledOcticon icon={FileIcon} />
      </Button>
      <input type="file" id="file" ref={inputFileRef} style={{ display: "none" }} onChange={handleFileUpload} />

      <ButtonPrimary
        ml={2}
        display={["block", "block", "none"]}
        sx={{
          height: "100%",
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
