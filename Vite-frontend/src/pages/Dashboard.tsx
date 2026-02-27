import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Button, LinearProgress,
  List, ListItem, ListItemText, ListItemIcon, Divider, Avatar, Paper, Chip,
} from '@mui/material';
import {
  DirectionsRun, EmojiEvents, Group, Event, CheckCircle,
  RadioButtonUnchecked, ArrowForward, Bolt, FitnessCenter,
  CalendarToday, LocationOn,
} from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useDashboardData } from '../context/useDashboardData';
import { ROUTES } from '../routes/paths';

const STAT_CARDS = [
  { label: 'Activități', hint: 'Adaugă prima activitate', color: '#e8f3ff', iconBg: '#1a6fff', Icon: DirectionsRun, link: ROUTES.ACTIVITIES },
  { label: 'Distanță Totală', hint: 'Pornește primul antrenament', color: '#edfaf3', iconBg: '#10b981', Icon: Bolt, link: ROUTES.ACTIVITIES },
  { label: 'Calorii Arse', hint: 'Urmărește progresul tău', color: '#fff7ed', iconBg: '#f59e0b', Icon: FitnessCenter, link: ROUTES.ACTIVITIES },
  { label: 'Zile Active', hint: 'Construiește un obicei', color: '#fdf2f8', iconBg: '#a855f7', Icon: Event, link: ROUTES.ACTIVITIES },
];

const PROGRESS_STEPS: { key: 'accountCreated' | 'profileCompleted' | 'firstActivity' | 'joinedClub' | 'joinedChallenge'; label: string; desc: string; link: string }[] = [
  { key: 'accountCreated', label: 'Creare cont', desc: 'Contul tău a fost creat cu succes', link: ROUTES.DASHBOARD },
  { key: 'profileCompleted', label: 'Completează profilul', desc: 'Adaugă telefon, locație sau bio', link: ROUTES.PROFILE },
  { key: 'firstActivity', label: 'Prima activitate', desc: 'Înregistrează primul tău antrenament', link: ROUTES.ACTIVITIES },
  { key: 'joinedClub', label: 'Alătură-te unui club', desc: 'Găsește un club sportiv local', link: ROUTES.CLUBS },
  { key: 'joinedChallenge', label: 'Participă la o provocare', desc: 'Înscrie-te la o provocare activă', link: ROUTES.CHALLENGES },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { activitatiCurente, provocariInscrise, cluburiJoined, evenimenteInscrise } = useDashboardData();

  const registeredDate = user?.registeredAt
      ? new Date(user.registeredAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

  const totalCalories = activitatiCurente.reduce((s, a) => s + a.calories, 0);
  const statValues = [
    activitatiCurente.length,
    `${activitatiCurente.reduce((s, a) => s + (parseFloat(a.distance) || 0), 0).toFixed(1)} km`,
    totalCalories,
    activitatiCurente.length > 0 ? activitatiCurente.length : 0,
  ];

  const completedSteps = PROGRESS_STEPS.filter(s => progress[s.key]).length;
  const progressPct = Math.round((completedSteps / PROGRESS_STEPS.length) * 100);

  return (
      <DashboardLayout>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#0f172a">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Bun venit, <Box component="span" sx={{ color: '#1a6fff', fontWeight: 700 }}>{user?.firstName}</Box>! 👋
          </Typography>
        </Box>

        {/* Welcome Banner */}
        <Paper elevation={0} sx={{
          mb: 3, p: { xs: 2.5, sm: 3.5 }, borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1a6fff 60%, #0ea5e9 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'absolute', right: 60, top: 50, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip label="🎉 Bun venit!" size="small" sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }} />
            <Typography variant="h6" fontWeight={900} gutterBottom>
              Cont creat cu succes!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 480, mb: 2.5, lineHeight: 1.7 }}>
              Te-ai înregistrat pe <strong>{registeredDate}</strong>. Ești gata să începi
              călătoria ta fitness alături de comunitatea FitMoldova.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="contained" size="small" endIcon={<ArrowForward />}
                      component={Link} to={ROUTES.ACTIVITIES}
                      sx={{ bgcolor: '#fff', color: '#1a6fff', fontWeight: 800, borderRadius: 2, '&:hover': { bgcolor: '#f0f7ff' }, boxShadow: 'none' }}>
                Adaugă activitate
              </Button>
              <Button variant="outlined" size="small" endIcon={<ArrowForward />}
                      component={Link} to={ROUTES.CHALLENGES}
                      sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' } }}>
                Provocări
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* ── STAT CARDS — full row of 4 ── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {STAT_CARDS.map((card, i) => (
              <Grid item xs={6} sm={3} key={card.label}>
                <Card elevation={0} component={Link} to={card.link}
                      sx={{ borderRadius: 3, bgcolor: card.color, border: '1px solid rgba(0,0,0,0.04)', textDecoration: 'none', display: 'block', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                        {card.label}
                      </Typography>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: `${card.iconBg}18` }}>
                        <card.Icon sx={{ color: card.iconBg, fontSize: 18 }} />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ lineHeight: 1 }}>
                      {String(statValues[i])}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                      {card.hint}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>

        {/* ── PROVOCĂRI ACTIVE — full width ── */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>🏆 Provocări Active</Typography>
                <Typography variant="caption" color="text.secondary">
                  {provocariInscrise.length > 0
                      ? `Ești înscris la ${provocariInscrise.length} provocări`
                      : 'Nu ești înscris la nicio provocare momentan'}
                </Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForward />} component={Link} to={ROUTES.CHALLENGES} sx={{ fontWeight: 700 }}>
                Vezi toate
              </Button>
            </Box>

            {provocariInscrise.length > 0 ? (
                <Grid container spacing={2}>
                  {provocariInscrise.slice(0, 4).map((p) => (
                      <Grid item xs={12} sm={6} md={3} key={p.id}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3' }}>
                          <Typography variant="body2" fontWeight={800} noWrap sx={{ mb: 0.5 }}>{p.name}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Chip label={p.difficulty} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                            <Typography variant="caption" color="text.secondary">{p.progress ?? 0}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={p.progress ?? 0}
                                          sx={{ height: 5, borderRadius: 3, bgcolor: '#e8edf3', '& .MuiLinearProgress-bar': { bgcolor: '#1a6fff', borderRadius: 3 } }} />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                            👥 {p.participants} participanți · ⏱ {p.duration}
                          </Typography>
                        </Box>
                      </Grid>
                  ))}
                </Grid>
            ) : (
                /* Suggestive preview of available challenges */
                <Grid container spacing={2}>
                  {[
                    { name: '100 km în Martie', participants: 312, difficulty: 'Mediu', duration: '30 zile' },
                    { name: 'Streak de 7 zile', participants: 891, difficulty: 'Ușor', duration: '7 zile' },
                    { name: '50 km Ciclism', participants: 156, difficulty: 'Mediu', duration: '14 zile' },
                    { name: 'Maraton Pregătire', participants: 204, difficulty: 'Greu', duration: '60 zile' },
                  ].map((ch) => (
                      <Grid item xs={12} sm={6} md={3} key={ch.name}>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px dashed #d1d9e8', bgcolor: '#fafbff', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{ch.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                            <Chip label={ch.difficulty} size="small"
                                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700,
                                    bgcolor: ch.difficulty === 'Ușor' ? '#ecfdf5' : ch.difficulty === 'Mediu' ? '#fffbeb' : '#fef2f2',
                                    color: ch.difficulty === 'Ușor' ? '#10b981' : ch.difficulty === 'Mediu' ? '#f59e0b' : '#ef4444' }} />
                            <Typography variant="caption" color="text.secondary">👥 {ch.participants}</Typography>
                          </Box>
                          <Button size="small" variant="outlined" component={Link} to={ROUTES.CHALLENGES}
                                  sx={{ borderRadius: 2, fontSize: '0.7rem', py: 0.25 }}>
                            Alătură-te
                          </Button>
                        </Box>
                      </Grid>
                  ))}
                </Grid>
            )}
          </CardContent>
        </Card>

        {/* ── PAȘI URMĂTORI — full width ── */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>🚀 Pași următori</Typography>
                <Typography variant="caption" color="text.secondary">
                  {completedSteps} din {PROGRESS_STEPS.length} pași completați
                </Typography>
              </Box>
              <Chip
                  label={`${progressPct}%`}
                  sx={{ bgcolor: progressPct === 100 ? '#ecfdf5' : '#f0f7ff', color: progressPct === 100 ? '#10b981' : '#1a6fff', fontWeight: 800, fontSize: '0.85rem' }}
              />
            </Box>

            {/* Overall progress bar */}
            <LinearProgress variant="determinate" value={progressPct}
                            sx={{ mb: 3, height: 8, borderRadius: 4, bgcolor: '#f0f4f8',
                              '& .MuiLinearProgress-bar': { bgcolor: progressPct === 100 ? '#10b981' : '#1a6fff', borderRadius: 4 } }} />

            {/* Steps as full-width row */}
            <Grid container spacing={2}>
              {PROGRESS_STEPS.map((step, i) => {
                const done = progress[step.key];
                return (
                    <Grid item xs={12} sm={6} md={12 / PROGRESS_STEPS.length as any} key={step.key}>
                      <Box
                          component={done ? 'div' : Link}
                          to={done ? undefined : step.link}
                          sx={{
                            p: 2, borderRadius: 2, textDecoration: 'none',
                            border: `1px solid ${done ? '#d1fae5' : '#e8edf3'}`,
                            bgcolor: done ? '#f0fdf4' : '#fafbff',
                            display: 'flex', flexDirection: 'column', gap: 1,
                            height: '100%',
                            transition: 'all 0.15s',
                            ...(!done && { '&:hover': { borderColor: '#1a6fff', bgcolor: '#f0f7ff', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(26,111,255,0.1)' } }),
                          }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            bgcolor: done ? '#dcfce7' : '#f0f4f8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 900,
                            color: done ? '#10b981' : '#94a3b8',
                          }}>
                            {done ? '✓' : i + 1}
                          </Box>
                          {done && <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />}
                        </Box>
                        <Typography variant="body2" fontWeight={700}
                                    sx={{ color: done ? '#166534' : '#0f172a', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>
                          {step.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: done ? '#4ade80' : '#64748b', lineHeight: 1.5 }}>
                          {done ? 'Completat ✓' : step.desc}
                        </Typography>
                      </Box>
                    </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* ── ACTIVITATE RECENTĂ + STATISTICI — full width ── */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800}>📋 Activitate recentă</Typography>
                  <Button size="small" endIcon={<ArrowForward />} component={Link} to={ROUTES.ACTIVITIES} sx={{ fontWeight: 700 }}>
                    Toate
                  </Button>
                </Box>
                {activitatiCurente.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h3" sx={{ mb: 1 }}>🏃</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Nu ai activități înregistrate</Typography>
                      <Button variant="outlined" size="small" component={Link} to={ROUTES.ACTIVITIES} sx={{ borderRadius: 2, mt: 1 }}>
                        Adaugă activitate
                      </Button>
                    </Box>
                ) : (
                    <List disablePadding>
                      {activitatiCurente.slice(0, 5).map((act, i) => (
                          <React.Fragment key={act.id}>
                            <ListItem disablePadding sx={{ py: 1.25 }}>
                              <ListItemIcon sx={{ minWidth: 44 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <DirectionsRun sx={{ color: '#1a6fff', fontSize: 20 }} />
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                  primary={<Typography variant="body2" fontWeight={700}>{act.name}</Typography>}
                                  secondary={
                                    <Box component="span" sx={{ display: 'flex', gap: 1.5, mt: 0.25, flexWrap: 'wrap' }}>
                                      <Typography variant="caption" color="text.secondary">{act.type}</Typography>
                                      <Typography variant="caption" color="text.secondary">{act.duration}</Typography>
                                      <Typography variant="caption" color="text.secondary">{act.calories} kcal</Typography>
                                    </Box>
                                  }
                              />
                              <Chip label={act.distance || '—'} size="small" sx={{ bgcolor: '#f0f4f8', color: '#64748b', fontSize: '0.7rem' }} />
                            </ListItem>
                            {i < Math.min(activitatiCurente.length, 5) - 1 && <Divider />}
                          </React.Fragment>
                      ))}
                    </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5 }}>📊 Sumarul meu</Typography>
                {[
                  { label: 'Cluburi înscrise', value: cluburiJoined.length, icon: '👥', link: ROUTES.CLUBS },
                  { label: 'Provocări active', value: provocariInscrise.length, icon: '🏆', link: ROUTES.CHALLENGES },
                  { label: 'Evenimente înscrise', value: evenimenteInscrise.length, icon: '📅', link: ROUTES.EVENTS_DASHBOARD },
                  { label: 'Total activități', value: activitatiCurente.length, icon: '🏃', link: ROUTES.ACTIVITIES },
                ].map((item, i) => (
                    <React.Fragment key={item.label}>
                      {i > 0 && <Divider sx={{ my: 1.25 }} />}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                            {item.icon}
                          </Box>
                          <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight={900} color="#0f172a">{item.value}</Typography>
                          <Button size="small" component={Link} to={item.link}
                                  sx={{ minWidth: 0, p: 0.5, color: '#94a3b8', '&:hover': { color: '#1a6fff' } }}>
                            <ArrowForward sx={{ fontSize: 16 }} />
                          </Button>
                        </Box>
                      </Box>
                    </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DashboardLayout>
  );
};

export default Dashboard;
