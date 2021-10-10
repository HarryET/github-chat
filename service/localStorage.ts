import { RecentChat } from "types";

export const saveRecentChat = (chat: RecentChat) => {
  localStorage.setItem("recent_chat", JSON.stringify(chat));
};

export const getRecentChat = () => {
  try {
    const item = localStorage.getItem("recent_chat");
    return item ? (JSON.parse(item) as RecentChat) : undefined;
  } catch (err) {
    return undefined;
  }
};
