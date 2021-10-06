import React, { FormEvent, KeyboardEvent, useState } from "react";
import { Box, TextInput } from "@primer/components";
import { useMutation } from "react-query";
import { supabase } from "service/supabase";

type Props = {
  chatId: string;
  memberId: string;
};

export const MessageInput = ({ chatId, memberId }: Props) => {
  const [value, setValue] = useState("");

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // Not supporting multiline messages for now
    if (newValue[newValue.length - 1] !== "\n") {
      setValue(e.currentTarget.value);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && value.trim().length > 0) {
      submitMessage();
      setValue("");
    }
  };

  const { mutate: submitMessage, error } = useMutation(async () => {
    const { error } = await supabase.from("messages").insert([
      {
        chat_id: chatId,
        member_id: memberId,
        content: value,
      },
    ]);
    if (error) {
      // TODO Handle in UI
      console.error(error);
    }
  });

  return (
    <Box paddingX={3} paddingBottom={3} flexShrink={0}>
      <TextInput
        as="textarea"
        height="100%"
        width="100%"
        border="1px solid"
        borderColor="border.subtle"
        sx={{
          backgroundColor: "canvas.overlay",
          ":focus-within": {
            borderColor: "fg.subtle",
            boxShadow: "none",
          },
        }}
        style={{
          // This does not work if set in sx
          resize: "none",
        }}
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
    </Box>
  );
};
