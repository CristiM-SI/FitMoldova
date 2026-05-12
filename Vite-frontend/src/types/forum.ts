export type ForumCategory = 'Toate' | 'Antrenament' | 'Nutriție' | 'Recuperare' | 'Competiții' | 'Echipament' | 'Motivație';

export interface ForumReply {
    id: number;
    author: string;
    avatar: string;
    color: string;
    handle: string;
    content: string;
    time: string;
    likes: number;
    liked: boolean;
    verified: boolean;
}

export interface ForumThread {
    id: number;
    author: string;
    avatar: string;
    color: string;
    handle: string;
    verified: boolean;
    content: string;
    category: ForumCategory;
    time: string;
    likes: number;
    liked: boolean;
    replies: ForumReply[];
    reposts: number;
    reposted: boolean;
    bookmarked: boolean;
    views: number;
    pinned?: boolean;
    image?: string;
    poll?: {
        question: string;
        options: { label: string; votes: number }[];
        totalVotes: number;
        voted: boolean;
    };
}

export interface SuggestedUser {
    id: number;
    name: string;
    handle: string;
    color: string;
    bio: string;
    verified: boolean;
    followers: number;
}

export const FORUM_CATEGORIES: ForumCategory[] = [
    'Toate', 'Antrenament', 'Nutriție', 'Recuperare', 'Competiții', 'Echipament', 'Motivație',
];
