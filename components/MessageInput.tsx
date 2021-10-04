import React, { FormEvent, KeyboardEvent, useState } from "react";
import { Box, TextInput } from "@primer/components";
import { useMutation } from "react-query";
import { supabase } from "../pages/_app";

type Props = {
  chatId: string;
  memberId: string;
};

export const MessageInput = ({ chatId, memberId }: Props) => {
  const [value, setValue] = useState("");

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
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
      console.log(error);
    }
  });

  return (
    <Box border="2px dashed green" height={128} padding={4}>
      <TextInput
        as="textarea"
        height="100%"
        width="100%"
        sx={{
          border: "none",
          backgroundColor: "canvas.overlay",
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
