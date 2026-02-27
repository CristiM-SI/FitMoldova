import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar,
  TextField, InputAdornment, Tabs, Tab, Rating, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider,
} from '@mui/material';
import { Search, Group, Add, ExitToApp, Close, LocationOn } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout.tsx';
import { useProgress } from '../../context/ProgressContext.tsx';
import { useDashboardData } from '../../context/useDashboardData.ts';
import type { Club } from '../../services/mock/cluburi.ts';

const CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'] as const;

const CAT_COLORS: Record<string, string> = {
  Alergare: '#3b82f6', Ciclism: '#10b981', Fitness: '#f59e0b',
  Yoga: '#a855f7', Înot: '#06b6d4', Trail: '#84cc16',
};

const ClubsDashboard: React.FC = () => {
  const { completeJoinClub } = useProgress();
  const { cluburiJoined: joined, cluburiDisponibile: available, addClub, removeClub } = useDashboardData();

  const [tabVal, setTabVal] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Toate');
  const [detailClub, setDetailClub] = useState<Club | null>(null);

  const joinClub = (club: Club) => { addClub(club); completeJoinClub(); setDetailClub(null); };
  const leaveClub = (id: number) => { removeClub(id); setDetailClub(null); };
  const isJoined = (id: number) => joined.some((c) => c.id === id);

  const displayList = tabVal === 0 ? available : joined;

  const filtered = useMemo(() => displayList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Toate' || c.category === filterCat;
    return matchSearch && matchCat;
  }), [displayList, search, filterCat]);

  const totalMembers = [...joined, ...available].reduce((s, c) => s + c.members, 0);

  return (
      <DashboardLayout>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#0f172a">Cluburi</Typography>
          <Typography variant="body2" color="text.secondary">Descoperă și alătură-te cluburilor sportive din comunitate</Typography>
        </Box>

        {/* Stats — 4 full row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Cluburi Disponibile', value: available.length, emoji: '🏟️', bg: '#f0f7ff', color: '#1a6fff' },
            { label: 'Cluburile Mele', value: joined.length, emoji: '👥', bg: '#ecfdf5', color: '#10b981' },
            { label: 'Total Membri', value: totalMembers.toLocaleString(), emoji: '🏃', bg: '#fffbeb', color: '#f59e0b' },
            { label: 'Categorii', value: CATEGORIES.length - 1, emoji: '🏅', bg: '#fdf4ff', color: '#a855f7' },
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

        {/* Filters */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2 }}>
              <Tab label={`Explorează (${available.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
              <Tab label={`Cluburile Mele (${joined.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Caută club sau locație..."
                         value={search} onChange={(e) => setSearch(e.target.value)}
                         InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
                         sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                    <Chip key={cat} label={cat} size="small" onClick={() => setFilterCat(cat)}
                          variant={filterCat === cat ? 'filled' : 'outlined'}
                          sx={{ fontSize: '0.75rem', bgcolor: filterCat === cat ? '#1a6fff' : 'transparent', color: filterCat === cat ? '#fff' : '#64748b', borderColor: '#e2e8f0' }} />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Club Grid */}
        {filtered.length === 0 ? (
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>🏟️</Typography>
                <Typography color="text.secondary" fontWeight={600}>
                  {tabVal === 1 ? 'Nu ești în niciun club. Explorează și alătură-te!' : 'Niciun club găsit.'}
                </Typography>
              </CardContent>
            </Card>
        ) : (
            <Grid container spacing={2}>
              {filtered.map((club) => {
                const joined_ = isJoined(club.id);
                const catColor = CAT_COLORS[club.category] || '#6366f1';
                return (
                    <Grid item xs={12} sm={6} md={4} key={club.id}>
                      <Card elevation={0} onClick={() => setDetailClub(club)}
                            sx={{ borderRadius: 3, border: `1px solid ${joined_ ? '#1a6fff30' : '#e8edf3'}`, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }, transition: 'all 0.2s', height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar sx={{ width: 48, height: 48, fontSize: '1.4rem', bgcolor: `${catColor}12`, borderRadius: '12px' }}>
                              {club.icon}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="body2" fontWeight={800} noWrap sx={{ flex: 1 }}>{club.name}</Typography>
                                {joined_ && <Chip label="✓ Înscris" size="small" sx={{ height: 18, bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.6rem', ml: 0.5 }} />}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                <LocationOn sx={{ fontSize: 11, color: '#94a3b8' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>{club.location}</Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                            {club.description.length > 85 ? club.description.slice(0, 85) + '...' : club.description}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                            <Chip label={club.category} size="small" sx={{ height: 20, bgcolor: `${catColor}12`, color: catColor, fontWeight: 700, fontSize: '0.68rem' }} />
                            <Chip label={club.level} size="small" sx={{ height: 20, bgcolor: '#f8faff', color: '#64748b', fontSize: '0.68rem' }} />
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Group sx={{ fontSize: 13, color: '#94a3b8' }} />
                              <Typography variant="caption" color="text.secondary">{club.members.toLocaleString()} membri</Typography>
                            </Box>
                            <Rating value={club.rating} readOnly size="small" precision={0.5} sx={{ fontSize: '0.8rem' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                );
              })}
            </Grid>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!detailClub} onClose={() => setDetailClub(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          {detailClub && (
              <>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: `${CAT_COLORS[detailClub.category] || '#6366f1'}12`, width: 48, height: 48, fontSize: '1.4rem', borderRadius: '12px' }}>
                      {detailClub.icon}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800}>{detailClub.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{detailClub.location}</Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={() => setDetailClub(null)} size="small"><Close /></IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>{detailClub.description}</Typography>
                  <Grid container spacing={1.5}>
                    {[
                      { label: 'Categorie', value: detailClub.category },
                      { label: 'Nivel', value: detailClub.level },
                      { label: 'Membri', value: detailClub.members.toLocaleString() },
                      { label: 'Înființat', value: detailClub.founded },
                      { label: 'Program', value: detailClub.schedule },
                      { label: 'Următor eveniment', value: detailClub.nextEvent },
                    ].filter(r => r.value).map((row) => (
                        <Grid item xs={6} key={row.label}>
                          <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                          <Typography variant="body2" fontWeight={700}>{row.value}</Typography>
                        </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 2 }}><Rating value={detailClub.rating} readOnly precision={0.5} /></Box>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setDetailClub(null)} sx={{ borderRadius: 2 }}>Închide</Button>
                  {isJoined(detailClub.id) ? (
                      <Button variant="outlined" color="error" startIcon={<ExitToApp />} onClick={() => leaveClub(detailClub.id)} sx={{ borderRadius: 2 }}>Părăsește</Button>
                  ) : (
                      <Button variant="contained" startIcon={<Add />} onClick={() => joinClub(detailClub)} sx={{ borderRadius: 2, boxShadow: 'none' }}>Alătură-te</Button>
                  )}
                </DialogActions>
              </>
          )}
        </Dialog>
      </DashboardLayout>
  );
};

export default ClubsDashboard;
