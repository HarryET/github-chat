export const MembershipQuery = `
repository: repositories!repository_id(
    owner,
    name,
    url
),
created_at,
updated_at`;

export type Membership = {
    repository: {
        owner: string;
        name: string;
        url: string;
    };
    created_at: string;
    updated_at: string;
};

export const ProfileQuery = `
id,
username,
avatar_url,
nickname,
bio,
private_key,
flags`;


export type UserProfile = {
    id: string,
    username: string,
    avatar_url: string,
    nickname: string | null,
    bio: string | null,
    private_key: string | null,
    flags: number
};
