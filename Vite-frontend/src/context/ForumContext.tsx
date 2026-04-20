import React, { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    SUGGESTED_USERS,
} from '../services/mock/forum';
import type {
    ForumThread,
    ForumReply,
    ForumCategory,
    SuggestedUser,
} from '../services/mock/forum';
import postApi, { type PostInfoDto } from '../services/api/postApi';
import { useAuth } from './AuthContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Message {
    id: number;
    fromHandle: string;
    fromName: string;
    fromAvatar: string;
    fromColor: string;
    toHandle: string;
    content: string;
    time: string;
    read: boolean;
}

interface ForumContextValue {
    threads: ForumThread[];
    setThreads: React.Dispatch<React.SetStateAction<ForumThread[]>>;
    loading: boolean;
    followedUsers: Set<string>;
    handleFollow: (user: SuggestedUser) => void;
    handleLike: (threadId: number, e: React.MouseEvent) => void;
    handleRepost: (threadId: number, e: React.MouseEvent) => void;
    handleBookmark: (threadId: number, e: React.MouseEvent) => void;
    handleReplyLike: (threadId: number, replyId: number) => void;
    handlePollVote: (threadId: number, optionIdx: number) => void;
    handlePublish: (content: string, category: ForumCategory, userName: string, userAvatar: string, userHandle: string) => void;
    handleReplySubmit: (replyText: string, expandedThread: number | null, userName: string, userAvatar: string, userHandle: string) => void;
    heartAnims: Set<number>;
    toast: { msg: string; visible: boolean };
    showToast: (msg: string) => void;
    messages: Message[];
    sendMessage: (toHandle: string, toName: string, toAvatar: string, toColor: string, content: string, fromHandle: string, fromName: string, fromAvatar: string, fromColor: string) => void;
    markAsRead: (msgId: number) => void;
}

const ForumContext = createContext<ForumContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const USER_COLORS = ['#1a6fff', '#e91e8c', '#00b894', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

function userColor(userId: number): string {
    return USER_COLORS[userId % USER_COLORS.length];
}

function formatRelativeTime(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'acum';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}z`;
}

function mapPostToThread(dto: PostInfoDto): ForumThread {
    return {
        id: dto.id,
        author: `Utilizator #${dto.userId}`,
        avatar: `U${dto.userId}`,
        color: userColor(dto.userId),
        handle: `@user${dto.userId}`,
        verified: false,
        content: dto.content,
        category: (dto.sport as ForumCategory) || 'Toate',
        time: formatRelativeTime(dto.createdAt),
        likes: dto.likes,
        liked: false,
        replies: [],
        reposts: 0,
        reposted: false,
        bookmarked: false,
        views: 0,
        commentsCount: dto.commentsCount,
    } as ForumThread & { commentsCount: number };
}

// ─── Mock messages (initial) ──────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        fromHandle: '@ion_fitness',
        fromName: 'Ion Ceban',
        fromAvatar: 'IC',
        fromColor: '#1a6fff',
        toHandle: '@me',
        content: 'Salut! Ai văzut programul pentru maratonul din septembrie?',
        time: '2h',
        read: false,
    },
    {
        id: 2,
        fromHandle: '@maria_runs',
        fromName: 'Maria Lungu',
        fromAvatar: 'ML',
        fromColor: '#e91e8c',
        toHandle: '@me',
        content: 'Super sesiune ieri! Repetăm săptămâna viitoare? 💪',
        time: '5h',
        read: false,
    },
    {
        id: 3,
        fromHandle: '@pavel_rotaru',
        fromName: 'Pavel Rotaru',
        fromAvatar: 'PR',
        fromColor: '#00b894',
        toHandle: '@me',
        content: 'Am postat un nou plan de antrenament pentru începători.',
        time: '1z',
        read: true,
    },
];

// ─── Provider ────────────────────────────────────────────────────────────────

export function ForumProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    const [heartAnims, setHeartAnims] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState({ msg: '', visible: false });
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

    const threadsRef = useRef(threads);
    threadsRef.current = threads;

    // Load posts from API on mount
    useEffect(() => {
        postApi.getAll()
            .then((posts) => setThreads(posts.map(mapPostToThread)))
            .catch(() => { /* Keep threads empty on error */ })
            .finally(() => setLoading(false));
    }, []);

    const showToast = useCallback((msg: string) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    }, []);

    const handleLike = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setHeartAnims((prev) => new Set(prev).add(threadId));
        setTimeout(() => setHeartAnims((prev) => { const n = new Set(prev); n.delete(threadId); return n; }), 350);
        // Optimistic update
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
                    : t
            )
        );
        // Sync with API
        if (user?.id) {
            postApi.like(threadId, user.id).catch(() => {
                // Revert on failure
                setThreads((prev) =>
                    prev.map((t) =>
                        t.id === threadId
                            ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
                            : t
                    )
                );
            });
        }
    }, [user]);

    const handleRepost = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? { ...t, reposted: !t.reposted, reposts: t.reposted ? t.reposts - 1 : t.reposts + 1 }
                    : t
            )
        );
        const thread = threadsRef.current.find((t) => t.id === threadId);
        if (thread && !thread.reposted) showToast('Repostat cu succes!');
    }, [showToast]);

    const handleBookmark = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const thread = threadsRef.current.find((t) => t.id === threadId);
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId ? { ...t, bookmarked: !t.bookmarked } : t
            )
        );
        showToast(thread?.bookmarked ? 'Eliminat din salvate' : 'Adăugat la salvate! 🔖');
    }, [showToast]);

    const handleReplyLike = useCallback((threadId: number, replyId: number) => {
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? {
                        ...t,
                        replies: t.replies.map((r) =>
                            r.id === replyId
                                ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                                : r
                        ),
                    }
                    : t
            )
        );
    }, []);

    const handlePollVote = useCallback((threadId: number, optionIdx: number) => {
        setThreads((prev) =>
            prev.map((t) => {
                if (t.id !== threadId || !t.poll || t.poll.voted) return t;
                const newOptions = t.poll.options.map((o, i) =>
                    i === optionIdx ? { ...o, votes: o.votes + 1 } : o
                );
                return {
                    ...t,
                    poll: { ...t.poll, options: newOptions, totalVotes: t.poll.totalVotes + 1, voted: true },
                };
            })
        );
        showToast('Votul tău a fost înregistrat!');
    }, [showToast]);

    const handlePublish = useCallback((
        content: string,
        category: ForumCategory,
        userName: string,
        userAvatar: string,
        userHandle: string,
    ) => {
        if (!user?.id) {
            showToast('Trebuie să fii autentificat pentru a posta.');
            return;
        }

        // Optimistic UI — add thread immediately with a temp id
        const tempId = -Date.now();
        const optimisticThread: ForumThread = {
            id: tempId,
            author: userName,
            avatar: userAvatar,
            color: '#1a6fff',
            handle: userHandle,
            verified: false,
            content: content.trim(),
            category,
            time: 'acum',
            likes: 0,
            liked: false,
            replies: [],
            reposts: 0,
            reposted: false,
            bookmarked: false,
            views: 0,
        };
        setThreads((prev) => [optimisticThread, ...prev]);
        showToast('Postarea ta a fost publicată!');

        postApi.create({ userId: user.id, content: content.trim(), sport: category })
            .then((realId) => {
                // Replace temp id with real id from server
                setThreads((prev) =>
                    prev.map((t) => t.id === tempId ? { ...t, id: realId } : t)
                );
            })
            .catch(() => {
                // Remove optimistic post on failure
                setThreads((prev) => prev.filter((t) => t.id !== tempId));
                showToast('Eroare la publicare. Încearcă din nou.');
            });
    }, [user, showToast]);

    const handleReplySubmit = useCallback((
        replyText: string,
        expandedThread: number | null,
        userName: string,
        userAvatar: string,
        userHandle: string,
    ) => {
        if (!replyText.trim() || expandedThread === null) return;
        if (!user?.id) {
            showToast('Trebuie să fii autentificat pentru a răspunde.');
            return;
        }

        const tempReplyId = -Date.now();
        const newReply: ForumReply = {
            id: tempReplyId,
            author: userName,
            avatar: userAvatar,
            color: '#1a6fff',
            handle: userHandle,
            content: replyText.trim(),
            time: 'acum',
            likes: 0,
            liked: false,
            verified: false,
        };
        setThreads((prev) =>
            prev.map((t) =>
                t.id === expandedThread
                    ? { ...t, replies: [newReply, ...t.replies] }
                    : t
            )
        );
        showToast('Răspunsul tău a fost adăugat!');

        postApi.addReply({ postId: expandedThread, userId: user.id, content: replyText.trim() })
            .then((realId) => {
                setThreads((prev) =>
                    prev.map((t) =>
                        t.id === expandedThread
                            ? {
                                ...t,
                                replies: t.replies.map((r) =>
                                    r.id === tempReplyId ? { ...r, id: realId } : r
                                ),
                            }
                            : t
                    )
                );
            })
            .catch(() => {
                setThreads((prev) =>
                    prev.map((t) =>
                        t.id === expandedThread
                            ? { ...t, replies: t.replies.filter((r) => r.id !== tempReplyId) }
                            : t
                    )
                );
                showToast('Eroare la trimitere. Încearcă din nou.');
            });
    }, [user, showToast]);

    const handleFollow = useCallback((user: SuggestedUser) => {
        setFollowedUsers((prev) => {
            const next = new Set(prev);
            if (next.has(user.handle)) {
                next.delete(user.handle);
                showToast(`Ai încetat să urmărești pe ${user.name}`);
            } else {
                next.add(user.handle);
                showToast(`Urmărești acum pe ${user.name}! 🎉`);
            }
            return next;
        });
    }, [showToast]);

    const sendMessage = useCallback((
        toHandle: string, toName: string, _toAvatar: string, _toColor: string,
        content: string,
        fromHandle: string, fromName: string, fromAvatar: string, fromColor: string,
    ) => {
        const newMsg: Message = {
            id: Date.now(),
            fromHandle,
            fromName,
            fromAvatar,
            fromColor,
            toHandle,
            content,
            time: 'acum',
            read: true,
        };
        setMessages((prev) => [newMsg, ...prev]);
        showToast(`Mesaj trimis către ${toName}! ✉️`);
    }, [showToast]);

    const markAsRead = useCallback((msgId: number) => {
        setMessages((prev) =>
            prev.map((m) => m.id === msgId ? { ...m, read: true } : m)
        );
    }, []);

    const ctxValue = useMemo<ForumContextValue>(() => ({
        threads, setThreads, loading,
        followedUsers, handleFollow,
        handleLike, handleRepost, handleBookmark,
        handleReplyLike, handlePollVote,
        handlePublish, handleReplySubmit,
        heartAnims, toast, showToast,
        messages, sendMessage, markAsRead,
    }), [
        threads, loading, followedUsers, handleFollow,
        handleLike, handleRepost, handleBookmark,
        handleReplyLike, handlePollVote,
        handlePublish, handleReplySubmit,
        heartAnims, toast, showToast,
        messages, sendMessage, markAsRead,
    ]);

    return (
        <ForumContext.Provider value={ctxValue}>
            {children}
        </ForumContext.Provider>
    );
}

export function useForumContext() {
    const ctx = useContext(ForumContext);
    if (!ctx) throw new Error('useForumContext must be used inside ForumProvider');
    return ctx;
}

export { SUGGESTED_USERS };