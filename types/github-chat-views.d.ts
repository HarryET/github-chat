declare module '@github-chat/views' {
    export type p_Chats = {
        id: string,
        repository_id: string,
        name: string,
        type: number,
        created_at: Date,
        updated_at: Date,
    };

    export type p_Messages = {
        id: string,
        type: number,
        chat_id: string,
        chat_name: string,
        repository_id: string,
        repository_name: string,
        author_profile_id: string,
        content?: string,
        attachments: p_MessagesAttachments[],
        mentions: string[],
        parent_message_id?: string,
        created_at: Date,
        edited_at: Date,
    };

    export type p_MessagesAttachments = {
        hash: string,
        file_name: string,
    };

    export type p_Repositories = {
        id: string,
        name: string,
        owner_id: string,
        owner_name: string,
        flags: number,
        created_at: Date,
        edited_at: Date,
    };

    export type p_Users = {
        id: string,
        username: string,
        provider_avatar: string,
        display_name?: string,
        avatar?: string,
        bio?: string,
        country?: string,
        banner_colour?: string,
        banner?: string,
        flags: number,
        created_at: string,
        edited_at: string,
    };

    export type p_Profiles = Omit<p_Users, "created_at" | "edited_at" | "id"> & {
        user_id: string,
        permission_override: number,
        repository_id: string,
        joined_at: Date,
        edited_at: Date,
        banned_at: Date,
    };

    export type p_Vanities = {
        id: string,
        type: 1 | 2,
        data: {
            id: string,
            [key: string]: any
        },
        created_at: Date,
        edited_at: Date,
    };

    export type p_UserVanities = p_Vanities;
    export type p_RepositoryVanities = p_Vanities;

    export type p_Reports = {
        id: string,
        type: number,
        reporter_id: string,
        resolved_at?: Date,
    };

    export type p_ReportsResolved = Omit<p_Reports, "resolved_at"> & {
        resolved_at: Date,
        resolved_by_id: string,
        resolved_by_username: string,
        resolved_by_avatar: string,
        resolved_by_provider_avatar: string
    }
}

