import React from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Chip,
    LinearProgress, Alert, Divider, Avatar, Paper,
} from '@mui/material';
import { EmojiEvents, Group, Timer, ArrowForward, ExitToApp, Add } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useProgress } from '../context/ProgressContext';
import { useDashboardData } from '../context/useDashboardData';
import type { Provocare } from '../services/mock/provocari';

const DIFF_CONFIG: Record<string, { color: string; bg: string }> = {
    'Ușor': { color: '#10b981', bg: '#ecfdf5' },
    'Mediu': { color: '#f59e0b', bg: '#fffbeb' },
    'Greu': { color: '#ef4444', bg: '#fef2f2' },
};

const Provocari: React.FC = () => {
    const { completeChallenge } = useProgress();
    const { provocariInscrise: inscrise, provocariDisponibile: disponibile, addProvocare, removeProvocare } = useDashboardData();

    const inscrieTe = (p: Provocare) => { addProvocare(p); completeChallenge(); };
    const totalParticipanti = inscrise.reduce((s, p) => s + p.participants, 0);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Provocări</Typography>
                <Typography variant="body2" color="text.secondary">Participă la provocări și depășește-ți limitele</Typography>
            </Box>

            {/* Stats — 4 full row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Provocări Active', value: inscrise.length, emoji: '🔥', bg: '#fef2f2', color: '#ef4444' },
                    { label: 'Disponibile', value: disponibile.length, emoji: '🏆', bg: '#fffbeb', color: '#f59e0b' },
                    { label: 'Completate', value: 0, emoji: '✅', bg: '#ecfdf5', color: '#10b981' },
                    { label: 'Total Participanți', value: totalParticipanti.toLocaleString(), emoji: '👥', bg: '#f0f7ff', color: '#1a6fff' },
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

            <Grid container spacing={3}>
                {/* Left: My challenges */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight={800}>Provocările Tale</Typography>
                                <Chip label={`${inscrise.length} active`} size="small"
                                      sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: '0.72rem' }} />
                            </Box>

                            {inscrise.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography variant="h3" sx={{ mb: 1 }}>🏅</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                                        Nicio provocare activă
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Alege o provocare din lista din dreapta!
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {inscrise.map((p) => {
                                        const cfg = DIFF_CONFIG[p.difficulty] || { color: '#6366f1', bg: '#f0f0ff' };
                                        return (
                                            <Paper key={p.id} elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography variant="body2" fontWeight={800} noWrap>{p.name}</Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                                            <Chip label={p.difficulty} size="small"
                                                                  sx={{ height: 18, fontSize: '0.65rem', bgcolor: cfg.bg, color: cfg.color, fontWeight: 700 }} />
                                                            <Typography variant="caption" color="text.secondary">⏱ {p.duration}</Typography>
                                                            <Typography variant="caption" color="text.secondary">👥 {p.participants}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button size="small" color="error" variant="outlined"
                                                            onClick={() => removeProvocare(p.id)}
                                                            sx={{ borderRadius: 2, fontSize: '0.68rem', ml: 1, flexShrink: 0, height: 30 }}>
                                                        Părăsește
                                                    </Button>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">Progres</Typography>
                                                    <Typography variant="caption" fontWeight={800} color="#1a6fff">{p.progress ?? 0}%</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={p.progress ?? 0}
                                                                sx={{ height: 6, borderRadius: 3, bgcolor: '#e8edf3', '& .MuiLinearProgress-bar': { bgcolor: '#1a6fff', borderRadius: 3 } }} />
                                            </Paper>
                                        );
                                    })}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Available challenges */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle1" fontWeight={800}>Provocări Disponibile</Typography>
                                <Chip label={`${disponibile.length} rămase`} size="small"
                                      sx={{ bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 700, fontSize: '0.72rem' }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Provocări populare din comunitatea FitMoldova
                            </Typography>

                            {disponibile.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography variant="h3" sx={{ mb: 1 }}>🎉</Typography>
                                    <Typography variant="body2" fontWeight={700} color="#10b981">Te-ai înscris la toate provocările!</Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {disponibile.map((p) => {
                                        const cfg = DIFF_CONFIG[p.difficulty] || { color: '#6366f1', bg: '#f0f0ff' };
                                        return (
                                            <Grid item xs={12} sm={6} key={p.id}>
                                                <Box sx={{
                                                    p: 2.5, borderRadius: 2, border: '1px solid #e8edf3',
                                                    bgcolor: '#fafbff', height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5,
                                                    transition: 'all 0.15s',
                                                    '&:hover': { borderColor: '#1a6fff', boxShadow: '0 4px 12px rgba(26,111,255,0.08)' },
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#f0f7ff', fontSize: '1.2rem' }}>🏆</Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.3 }}>{p.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, lineHeight: 1.5 }}>
                                                                {p.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                                        <Chip label={p.difficulty} size="small"
                                                              sx={{ height: 18, fontSize: '0.65rem', bgcolor: cfg.bg, color: cfg.color, fontWeight: 700 }} />
                                                        <Typography variant="caption" color="text.secondary">⏱ {p.duration}</Typography>
                                                        <Typography variant="caption" color="text.secondary">👥 {p.participants}</Typography>
                                                    </Box>
                                                    <Button fullWidth variant="contained" size="small" startIcon={<Add />}
                                                            onClick={() => inscrieTe(p)}
                                                            sx={{ borderRadius: 2, boxShadow: 'none', fontWeight: 700, mt: 'auto' }}>
                                                        Alătură-te
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
};

export default Provocari;
