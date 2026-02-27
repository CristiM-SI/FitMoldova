import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Chip,
    LinearProgress, Divider, Paper, Tabs, Tab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useProgress } from '../../context/ProgressContext';
import { useDashboardData } from '../../context/useDashboardData';
import type { Provocare } from '../../services/mock/provocari';

const DIFF_CONFIG: Record<string, { color: string; bg: string }> = {
    'Usor': { color: '#10b981', bg: '#ecfdf5' },
    'Mediu': { color: '#f59e0b', bg: '#fffbeb' },
    'Greu': { color: '#ef4444', bg: '#fef2f2' },
};

// Normalize difficulty keys that may contain diacritics
function getDiffConfig(difficulty: string) {
    const normalized = difficulty.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return DIFF_CONFIG[normalized] || { color: '#6366f1', bg: '#f0f0ff' };
}

const Provocari: React.FC = () => {
    const { completeChallenge } = useProgress();
    const { provocariInscrise: inscrise, provocariDisponibile: disponibile, addProvocare, removeProvocare } = useDashboardData();
    const [tab, setTab] = useState(0);

    const inscrieTe = (p: Provocare) => { addProvocare(p); completeChallenge(); };
    const totalParticipanti = inscrise.reduce((s, p) => s + p.participants, 0);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Provocari</Typography>
                <Typography variant="body2" color="text.secondary">Participa la provocari si depaseste-ti limitele</Typography>
            </Box>

            {/* Stats — 4 per row flex */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {[
                    { label: 'Provocari Active', value: inscrise.length, emoji: '🔥', bg: '#fef2f2' },
                    { label: 'Disponibile', value: disponibile.length, emoji: '🏆', bg: '#fffbeb' },
                    { label: 'Completate', value: 0, emoji: '✅', bg: '#ecfdf5' },
                    { label: 'Total Participanti', value: totalParticipanti.toLocaleString(), emoji: '👥', bg: '#f0f7ff' },
                ].map((s) => (
                    <Box key={s.label} sx={{ flex: '1 1 180px', minWidth: 0 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                                    <Typography fontSize="1.4rem">{s.emoji}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Tabs: Inscrise / Disponibile */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
                <Box sx={{ borderBottom: '1px solid #e8edf3' }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Provocarile Mele
                                    <Chip label={inscrise.length} size="small"
                                          sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 800 }} />
                                </Box>
                            }
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Disponibile
                                    <Chip label={disponibile.length} size="small"
                                          sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 800 }} />
                                </Box>
                            }
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    {/* Tab: Provocarile Mele */}
                    {tab === 0 && (
                        <>
                            {inscrise.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography variant="h3" sx={{ mb: 1 }}>🏅</Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                                        Nicio provocare activa
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Mergi la tab-ul Disponibile si alatura-te unei provocari!
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {inscrise.map((p) => {
                                        const cfg = getDiffConfig(p.difficulty);
                                        return (
                                            <Box key={p.id} sx={{ flex: '1 1 280px', minWidth: 0 }}>
                                                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3', height: '100%' }}>
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
                                                            Paraseste
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">Progres</Typography>
                                                        <Typography variant="caption" fontWeight={800} color="#1a6fff">{p.progress ?? 0}%</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={p.progress ?? 0}
                                                                    sx={{ height: 6, borderRadius: 3, bgcolor: '#e8edf3', '& .MuiLinearProgress-bar': { bgcolor: '#1a6fff', borderRadius: 3 } }} />
                                                </Paper>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </>
                    )}

                    {/* Tab: Disponibile */}
                    {tab === 1 && (
                        <>
                            {disponibile.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography variant="h3" sx={{ mb: 1 }}>🎉</Typography>
                                    <Typography variant="body2" fontWeight={700} color="#10b981">
                                        Te-ai inscris la toate provocarile!
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Provocari populare din comunitatea FitMoldova
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        {disponibile.map((p) => {
                                            const cfg = getDiffConfig(p.difficulty);
                                            return (
                                                <Box key={p.id} sx={{ flex: '1 1 280px', minWidth: 0 }}>
                                                    <Box sx={{
                                                        p: 2.5, borderRadius: 2, border: '1px solid #e8edf3',
                                                        bgcolor: '#fafbff', height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5,
                                                        transition: 'all 0.15s',
                                                        '&:hover': { borderColor: '#1a6fff', boxShadow: '0 4px 12px rgba(26,111,255,0.08)' },
                                                    }}>
                                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏆</Box>
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
                                                            Alaturai-te
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default Provocari;
