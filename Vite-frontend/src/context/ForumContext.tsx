import React, { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type {
    ForumThread,
    ForumReply,
    ForumCategory,
    SuggestedUser,
} from '../types/forum'
import postApi, { type PostInfoDto } from '../services/api/postApi';
import { userApi } from '../services/api/userApi';
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
    suggestedUsers: SuggestedUser[];
    followedUsers: Set<string>;
    handleFollow: (user: SuggestedUser) => void;
    handleLike: (threadId: number, e: React.MouseEvent) => void;
    handleRepost: (threadId: number, e: React.MouseEvent) => void;
    handleBookmark: (threadId: number, e: React.MouseEvent) => void;
    handleReplyLike: (threadId: number, replyId: number) => void;
    handlePollVote: (threadId: number, optionIdx: number) => void;
    handlePublish: (content: string, category: ForumCategory, userName: string, userAvatar: string, userHandle: string, imageUrl?: string, pollOptions?: string[]) => void;
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
        author: dto.authorName,
        avatar: dto.authorName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2),
        color: userColor(dto.userId),
        handle: `@${dto.authorUsername}`,
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
        image: dto.imageUrl ?? undefined,
        commentsCount: dto.commentsCount,
    } as ForumThread & { commentsCount: number };
}

// TODO: v2 - necesită SignalR
// Mesageria privată este dezactivată temporar până la implementarea WebSocket/SignalR
// const INITIAL_MESSAGES: Message[] = [...]

// ─── Provider ────────────────────────────────────────────────────────────────

export function ForumProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    const [heartAnims, setHeartAnims] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState({ msg: '', visible: false });
    // TODO: v2 - necesită SignalR
    const [messages] = useState<Message[]>([]);

    const threadsRef = useRef(threads);
    threadsRef.current = threads;

    // Load posts from API on mount
    useEffect(() => {
        postApi.getAll()
            .then((posts) => {
                setThreads(posts.map(mapPostToThread));
                postApi.getBookmarked().then(bookmarked => {
                    const ids = new Set(bookmarked.map(p => p.id));
                    setThreads(prev => prev.map(t => ({ ...t, bookmarked: ids.has(t.id) })));
                }).catch(() => {});
            })
            .catch(() => { /* Keep threads empty on error */ })
            .finally(() => setLoading(false));
    }, []);

    // Load suggested users and already-followed users from API
    useEffect(() => {
        const AVATAR_COLORS = ['#1a6fff', '#e84393', '#00b894', '#fdcb6e', '#6c5ce7', '#e17055'];

        userApi.getCommunity()
            .then((community) => {
                const mapped: SuggestedUser[] = community.slice(0, 6).map((u, i) => ({
                    id: u.id,
                    name: `${u.firstName} ${u.lastName}`,
                    handle: `@${u.username}`,
                    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    bio: u.bio ?? '',
                    verified: false,
                    followers: 0,
                }));
                setSuggestedUsers(mapped);
            })
            .catch(() => { /* rămâne lista goală */ });

        userApi.getFollowing()
            .then((following) => {
                setFollowedUsers(new Set(following.map((f) => `@${f.username}`)));
            })
            .catch(() => { /* rămâne gol */ });
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
            postApi.like(threadId).catch(() => {
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
        const thread = threadsRef.current.find((t) => t.id === threadId);
        const isNowReposted = !thread?.reposted;
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? { ...t, reposted: !t.reposted, reposts: t.reposted ? t.reposts - 1 : t.reposts + 1 }
                    : t
            )
        );
        if (isNowReposted) {
            showToast('Repostat cu succes!');
            postApi.repostPost(threadId).catch(() => {
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, reposted: false, reposts: Math.max(0, t.reposts - 1) } : t));
                showToast('Eroare la repost');
            });
        }
    }, [showToast]);

    const handleBookmark = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const thread = threadsRef.current.find((t) => t.id === threadId);
        const isNowBookmarked = !thread?.bookmarked;
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId ? { ...t, bookmarked: !t.bookmarked } : t
            )
        );
        showToast(thread?.bookmarked ? 'Eliminat din salvate' : 'Adăugat la salvate! 🔖');
        if (isNowBookmarked) {
            postApi.bookmarkPost(threadId).catch(() => {
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, bookmarked: false } : t));
                showToast('Eroare la salvare');
            });
        } else {
            postApi.unbookmarkPost(threadId).catch(() => {
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, bookmarked: true } : t));
                showToast('Eroare la eliminare');
            });
        }
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
        postApi.likeComment(replyId).catch(() => {
            setThreads(prev => prev.map(t => {
                if (t.id !== threadId) return t;
                return {
                    ...t,
                    replies: t.replies.map(r => r.id === replyId ? { ...r, likes: Math.max(0, r.likes - 1) } : r)
                };
            }));
        });
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
        postApi.votePoll(threadId, optionIdx).catch(() => {
            showToast('Eroare la vot — încearcă din nou');
        });
    }, [showToast]);

    const handlePublish = useCallback((
        content: string,
        category: ForumCategory,
        userName: string,
        userAvatar: string,
        userHandle: string,
        imageUrl?: string,
        pollOptions?: string[],
    ) => {
        if (!user?.id) {
            showToast('Trebuie să fii autentificat pentru a posta.');
            return;
        }

        // Doar opțiunile completate, minim 2 pentru un sondaj valid
        const cleanPoll = (pollOptions ?? []).map((o) => o.trim()).filter(Boolean);
        const hasPoll = cleanPoll.length >= 2;

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
            image: imageUrl || undefined,
            poll: hasPoll
                ? { question: '', options: cleanPoll.map((label) => ({ label, votes: 0 })), totalVotes: 0, voted: false }
                : undefined,
        };
        setThreads((prev) => [optimisticThread, ...prev]);
        showToast('Postarea ta a fost publicată!');

        postApi.create({
            userId: user.id,
            content: content.trim(),
            sport: category,
            imageUrl: imageUrl || undefined,
            pollOptions: hasPoll ? cleanPoll : undefined,
        })
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

    const handleFollow = useCallback((targetUser: SuggestedUser) => {
        const isFollowing = followedUsers.has(targetUser.handle);

        // Optimistic update
        setFollowedUsers((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(targetUser.handle);
            else next.add(targetUser.handle);
            return next;
        });

        // Apel real la API
        const apiCall = isFollowing
            ? userApi.unfollow(targetUser.id)
            : userApi.follow(targetUser.id);

        apiCall
            .then(() => {
                showToast(
                    isFollowing
                        ? `Ai încetat să urmărești pe ${targetUser.name}`
                        : `Urmărești acum pe ${targetUser.name}! 🎉`
                );
            })
            .catch(() => {
                // Rollback dacă API-ul a eșuat
                setFollowedUsers((prev) => {
                    const next = new Set(prev);
                    if (isFollowing) next.add(targetUser.handle);
                    else next.delete(targetUser.handle);
                    return next;
                });
                showToast('Eroare la urmărire. Încearcă din nou.');
            });
    }, [followedUsers, showToast]);

    // TODO: v2 - necesită SignalR
    const sendMessage = useCallback((_toHandle: string, _toName: string, _toAvatar: string, _toColor: string,
        _content: string, _fromHandle: string, _fromName: string, _fromAvatar: string, _fromColor: string,
    ) => { /* disabled until SignalR */ }, []);

    // TODO: v2 - necesită SignalR
    const markAsRead = useCallback((_msgId: number) => { /* disabled until SignalR */ }, []);

    const ctxValue = useMemo<ForumContextValue>(() => ({
        threads, setThreads, loading,
        suggestedUsers, followedUsers, handleFollow,
        handleLike, handleRepost, handleBookmark,
        handleReplyLike, handlePollVote,
        handlePublish, handleReplySubmit,
        heartAnims, toast, showToast,
        messages, sendMessage, markAsRead,
    }), [
        threads, loading, suggestedUsers, followedUsers, handleFollow,
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

