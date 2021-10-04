import { supabase } from "./pages/_app";
import { Member } from "./types";

const fetchMembers = async (chatId: string) => {
  const { data, error } = await supabase
    .from<Member>("members")
    .select(`id, chat_id, user_id, nickname`)
    .eq("chat_id", chatId);
  if (error) {
    throw error;
  }
  return data || [];
};
