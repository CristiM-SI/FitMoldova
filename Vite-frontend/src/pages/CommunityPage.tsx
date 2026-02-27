import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar,
    TextField, Tabs, Tab, IconButton, Divider, LinearProgress,
} from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Send, EmojiEvents } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import {
    SPORTS, SPORT_CHIPS, INITIAL_CHALLENGES, MEMBERS, MEMBER_POSTS,
} from '../services/mock/community';
import type { Sport, FeedTab, Post, Challenge, Member } from '../services/mock/community';

const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const CommunityPage: React.FC = () => {
    const [tab, setTab] = useState<FeedTab>('feed');
    const [sportFilter, setSportFilter] = useState<Sport | 'all'>('all');
    const [posts, setPosts] = useState<Post[]>(MEMBER_POSTS);
    const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
    const [newPostText, setNewPostText] = useState('');
    const [expandedMember, setExpandedMember] = useState<string | null>(null);

    const toggleLike = useCallback((id: number) => {
        setPosts((prev) => prev.map((p) =>
            p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
        ));
    }, []);

    const toggleChallenge = useCallback((id: number) => {
        setChallenges((prev) => prev.map((c) =>
            c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
        ));
    }, []);

    const submitPost = () => {
        if (!newPostText.trim()) return;
        setPosts((prev) => [{
            id: Date.now(), author: 'Tu', color: '#1a6fff', sport: 'Atletism',
            time: 'Acum', content: newPostText.trim(), likes: 0, comments: 0, liked: false,
        }, ...prev]);
        setNewPostText('');
    };

    const filteredPosts = sportFilter === 'all' ? posts : posts.filter((p) => p.sport === sportFilter);
    const filteredMembers = sportFilter === 'all' ? MEMBERS : MEMBERS.filter((m) => m.sport === sportFilter);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Comunitate</Typography>
                <Typography variant="body2" color="text.secondary">Conectează-te cu sportivii din Moldova</Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Membri Activi', value: MEMBERS.length, emoji: '👥', bg: '#f0f7ff' },
                    { label: 'Sporturi', value: SPORTS.length, emoji: '🏅', bg: '#fffbeb' },
                    { label: 'Postări', value: posts.length, emoji: '📝', bg: '#ecfdf5' },
                    { label: 'Provocări Community', value: challenges.length, emoji: '🏆', bg: '#fdf4ff' },
                ].map((s) => (
                    <Grid item xs={6} sm={3} key={s.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                                    <Typography fontSize="1.4rem">{s.emoji}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Sport Filter */}
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                {SPORT_CHIPS.slice(0, 12).map((chip) => (
                    <Chip key={chip.value} label={`${chip.emoji} ${chip.label}`}
                          onClick={() => setSportFilter(chip.value as Sport | 'all')}
                          variant={sportFilter === chip.value ? 'filled' : 'outlined'}
                          size="small"
                          sx={{ fontSize: '0.75rem', bgcolor: sportFilter === chip.value ? '#1a6fff' : 'transparent', color: sportFilter === chip.value ? '#fff' : '#64748b', borderColor: '#e2e8f0' }} />
                ))}
            </Box>

            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #e8edf3' }}>
                <Tab value="feed" label="Feed" sx={{ fontWeight: 700, textTransform: 'none' }} />
                <Tab value="challenges" label="Provocări" sx={{ fontWeight: 700, textTransform: 'none' }} />
                <Tab value="members" label="Membri" sx={{ fontWeight: 700, textTransform: 'none' }} />
            </Tabs>

            {/* FEED */}
            {tab === 'feed' && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {/* Composer */}
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: '#1a6fff', width: 38, height: 38, fontSize: '0.75rem' }}>TU</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField fullWidth multiline rows={2} placeholder="Împărtășește o activitate sau gând..."
                                                   value={newPostText} onChange={(e) => setNewPostText(e.target.value)}
                                                   variant="outlined" size="small"
                                                   sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="contained" size="small" endIcon={<Send />}
                                                    onClick={submitPost} disabled={!newPostText.trim()}
                                                    sx={{ borderRadius: 2, boxShadow: 'none', fontWeight: 700 }}>
                                                Postează
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Posts */}
                        {filteredPosts.map((post) => (
                            <Card key={post.id} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: post.color, width: 40, height: 40, fontSize: '0.8rem' }}>
                                            {getInitials(post.author)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight={800}>{post.author}</Typography>
                                                <Chip label={post.sport} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#f0f7ff', color: '#1a6fff' }} />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">{post.time}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>{post.content}</Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <IconButton size="small" onClick={() => toggleLike(post.id)} sx={{ color: post.liked ? '#ef4444' : '#94a3b8' }}>
                                                {post.liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                            </IconButton>
                                            <Typography variant="caption" color="text.secondary">{post.likes}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ChatBubbleOutline sx={{ fontSize: 16, color: '#94a3b8' }} />
                                            <Typography variant="caption" color="text.secondary">{post.comments}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>🏆 Top Membri</Typography>
                                {MEMBERS.slice(0, 5).map((m, i) => (
                                    <React.Fragment key={m.name}>
                                        {i > 0 && <Divider sx={{ my: 1 }} />}
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                                {i + 1}
                                            </Box>
                                            <Avatar sx={{ bgcolor: m.color, width: 30, height: 30, fontSize: '0.65rem' }}>
                                                {getInitials(m.name)}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="caption" fontWeight={700} noWrap>{m.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{m.sport}</Typography>
                                            </Box>
                                            <Typography variant="caption" fontWeight={800} color="#1a6fff">{m.points}p</Typography>
                                        </Box>
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>

                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>📊 Statistici</Typography>
                                {[
                                    { label: 'Membri activi', value: MEMBERS.length },
                                    { label: 'Sporturi reprezentate', value: SPORTS.length },
                                    { label: 'Postări totale', value: posts.length },
                                ].map((s, i) => (
                                    <React.Fragment key={s.label}>
                                        {i > 0 && <Divider sx={{ my: 1 }} />}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                            <Typography variant="caption" fontWeight={800}>{s.value}</Typography>
                                        </Box>
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* CHALLENGES */}
            {tab === 'challenges' && (
                <Grid container spacing={2}>
                    {challenges.map((ch) => (
                        <Grid item xs={12} sm={6} md={4} key={ch.id}>
                            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Chip label={ch.sport} size="small" sx={{ mb: 0.75, bgcolor: '#f0f7ff', color: '#1a6fff', fontWeight: 700, fontSize: '0.68rem' }} />
                                            <Typography variant="body2" fontWeight={800}>{ch.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{ch.desc}</Typography>
                                        </Box>
                                        <EmojiEvents sx={{ color: '#f59e0b', fontSize: 28, flexShrink: 0 }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">👥 {ch.participants}</Typography>
                                        <Typography variant="caption" color="text.secondary">📅 {ch.days} zile</Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Progres global</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#1a6fff">{ch.progress}%</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={ch.progress}
                                                        sx={{ height: 5, borderRadius: 3, bgcolor: '#f0f7ff', '& .MuiLinearProgress-bar': { bgcolor: '#1a6fff', borderRadius: 3 } }} />
                                    </Box>
                                    <Button fullWidth variant={ch.joined ? 'outlined' : 'contained'} color={ch.joined ? 'error' : 'primary'}
                                            size="small" sx={{ borderRadius: 2, fontWeight: 700, boxShadow: 'none', mt: 'auto' }}
                                            onClick={() => toggleChallenge(ch.id)}>
                                        {ch.joined ? 'Părăsește' : 'Alătură-te'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* MEMBERS */}
            {tab === 'members' && (
                <Grid container spacing={2}>
                    {filteredMembers.map((member) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
                            <Card elevation={0} onClick={() => setExpandedMember(expandedMember === member.name ? null : member.name)}
                                  sx={{ borderRadius: 3, border: `1px solid ${expandedMember === member.name ? '#1a6fff' : '#e8edf3'}`, cursor: 'pointer', '&:hover': { border: '1px solid #1a6fff', boxShadow: '0 4px 20px rgba(26,111,255,0.1)' }, transition: 'all 0.2s', height: '100%' }}>
                                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                                    <Avatar sx={{ bgcolor: member.color, width: 52, height: 52, fontSize: '1rem', mx: 'auto', mb: 1.5 }}>
                                        {getInitials(member.name)}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight={800}>{member.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{member.city}</Typography>
                                    <Chip label={member.sport} size="small" sx={{ mt: 0.75, mb: 1.5, bgcolor: '#f0f7ff', color: '#1a6fff', fontWeight: 700, fontSize: '0.68rem' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={900} color="#1a6fff">{member.points}</Typography>
                                            <Typography variant="caption" color="text.secondary">Puncte</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={900}>{member.activities}</Typography>
                                            <Typography variant="caption" color="text.secondary">Activități</Typography>
                                        </Box>
                                    </Box>
                                    {expandedMember === member.name && (
                                        <Box sx={{ mt: 2, textAlign: 'left', borderTop: '1px solid #f0f4f8', pt: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, lineHeight: 1.5 }}>{member.bio}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                🏆 {member.challenges} provocări · 📅 {member.daysActive} zile
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </DashboardLayout>
    );
};

export default CommunityPage;
