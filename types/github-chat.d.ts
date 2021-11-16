declare module '@github-chat/types' {
    export type SupabaseViews = "p_Users" | "p_Profiles" | "p_Repositories" | "p_Chats" | "p_Messages" | "p_Vanities" | "p_UserVanities" | "p_RepositoryVanities" | "p_Reports";
    export type SupabaseTables = "Users" | "Member_Profiles" | "Messages" | "Reports" | "Repositories" | "Vanities";

    export type SupabaseQueryable = SupabaseViews | SupabaseTables;
}