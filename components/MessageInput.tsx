import React from "react";
import { Box } from "@primer/components";
import { useMutation } from "react-query";
import { supabase } from "../pages/_app";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";

type Props = {
  chatId: string;
  memberId: string;
};

export const MessageInput = ({ chatId, memberId }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Extension.create({
        addKeyboardShortcuts: () => ({
          Enter: ({ editor }) => {
            submitMessage(editor.getHTML());
            editor.commands.clearContent();
            return true;
          },
        }),
      }),
    ],
  });

  const { mutate: submitMessage, error } = useMutation(
    async (content: string) => {
      const { error } = await supabase.from("messages").insert([
        {
          chat_id: chatId,
          member_id: memberId,
          content,
        },
      ]);
      if (error) {
        // TODO Handle in UI
        console.error(error);
      }
    }
  );

  return (
    <Box paddingX={3} paddingBottom={3} flexShrink={0}>
      <EditorContent editor={editor} />
    </Box>
  );
};
