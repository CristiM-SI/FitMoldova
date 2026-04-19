import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Box, Typography, Card, CardContent, Button, LinearProgress,
  List, ListItem, ListItemText, ListItemIcon, Divider, Paper, Chip, Skeleton,
} from '@mui/material';
import {
  DirectionsRun, CheckCircle, RadioButtonUnchecked,
  ArrowForward, Bolt, FitnessCenter, Event,
} from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { useDashboardApi } from '../../hooks/useDashboardApi';
import { ROUTES } from '../../routes/paths';
import { useUserClubs } from '../../hooks/useUserClubs';

const PROGRESS_STEPS: {
  key: 'accountCreated' | 'profileCompleted' | 'firstActivity' | 'joinedClub' | 'joinedChallenge';
  label: string;
  desc: string;
  link: string;
}[] = [
  { key: 'accountCreated',   label: 'Creare cont',            desc: 'Contul tău a fost creat',                link: ROUTES.DASHBOARD },
  { key: 'profileCompleted', label: 'Completează profilul',   desc: 'Adaugă telefon, locație sau bio',         link: ROUTES.PROFILE },
  { key: 'firstActivity',    label: 'Prima activitate',       desc: 'Înregistrează primul antrenament',        link: ROUTES.ACTIVITIES },
  { key: 'joinedClub',       label: 'Alătură-te unui club',   desc: 'Găsește un club local',                   link: ROUTES.CLUBS },
  { key: 'joinedChallenge',  label: 'Participă la o provocare', desc: 'Înscrie-te la o provocare',             link: ROUTES.CHALLENGES },
];

const ACTIVITY_ICONS: Record<string, string> = {
  Alergare: '🏃', Ciclism: '🚴', Înot: '🏊', Fitness: '💪',
  Fotbal: '⚽', Baschet: '🏀', Tenis: '🎾', Hiking: '🥾',
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { count: cluburiJoinedCount } = useUserClubs();
  const { activities, challenges, events, joinedChallengeIds, loading } = useDashboardApi();

  const registeredDate = useMemo(() =>
    user?.registeredAt
      ? new Date(user.registeredAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
  [user?.registeredAt]);

  // Statistici calculate din date reale API
  const stats = useMemo(() => {
    const totalCalories = activities.reduce((s, a) => s + (a.calories || 0), 0);
    const totalDist = activities.reduce((s, a) => s + (parseFloat(a.distance) || 0), 0);
    // Zile unice cu activitate
    const uniqueDays = new Set(activities.map(a => a.date?.slice(0, 10))).size;
    return {
      totalActivities: activities.length,
      totalDistance: totalDist.toFixed(1),
      totalCalories,
      activeDays: uniqueDays,
    };
  }, [activities]);

  const statCards = [
    { label: 'Activități',     value: loading ? '—' : String(stats.totalActivities), hint: 'Activități înregistrate', color: '#e8f3ff', iconBg: '#1a6fff', Icon: DirectionsRun, link: ROUTES.ACTIVITIES },
    { label: 'Distanță Totală', value: loading ? '—' : `${stats.totalDistance} km`,  hint: 'Kilometri parcurși',      color: '#edfaf3', iconBg: '#10b981', Icon: Bolt,          link: ROUTES.ACTIVITIES },
    { label: 'Calorii Arse',   value: loading ? '—' : String(stats.totalCalories),   hint: 'Calorii consumate',       color: '#fff7ed', iconBg: '#f59e0b', Icon: FitnessCenter, link: ROUTES.ACTIVITIES },
    { label: 'Zile Active',    value: loading ? '—' : String(stats.activeDays),       hint: 'Zile cu activitate',      color: '#fdf2f8', iconBg: '#a855f7', Icon: Event,         link: ROUTES.ACTIVITIES },
  ];

  const { completedSteps, progressPct } = useMemo(() => {
    const completed = PROGRESS_STEPS.filter(s => progress[s.key]).length;
    return {
      completedSteps: completed,
      progressPct: Math.round((completed / PROGRESS_STEPS.length) * 100),
    };
  }, [progress]);

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
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip label="🎉 Bun venit!" size="small" sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }} />
          <Typography variant="h6" fontWeight={900} gutterBottom>Cont creat cu succes!</Typography>
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

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {statCards.map((card) => (
          <Box key={card.label} sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Card elevation={0} component={Link} to={card.link}
                  sx={{ borderRadius: 3, bgcolor: card.color, border: '1px solid rgba(0,0,0,0.04)', textDecoration: 'none', display: 'block', height: '100%', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' } }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                    {card.label}
                  </Typography>
                  <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: `${card.iconBg}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <card.Icon sx={{ color: card.iconBg, fontSize: 18 }} />
                  </Box>
                </Box>
                {loading
                  ? <Skeleton variant="text" width={60} height={40} />
                  : <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ lineHeight: 1 }}>{card.value}</Typography>
                }
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                  {card.hint}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Provocări Active + Pași următori */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>

        {/* Provocări Active — date din API */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>🏆 Provocări Active</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loading ? 'Se încarcă...' : `${challenges.length} provocări disponibile`}
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForward />} component={Link} to={ROUTES.CHALLENGES} sx={{ fontWeight: 700 }}>
                  Vezi toate
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={64} />)}
                </Box>
              ) : challenges.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {challenges.slice(0, 3).map((ch) => {
                    const isJoined = joinedChallengeIds.includes(ch.id);
                    return (
                      <Box key={ch.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: isJoined ? '#ecfdf5' : '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                            {isJoined ? '✅' : '🏅'}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 180 }}>{ch.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{ch.participants ?? 0} participanți · {ch.duration}</Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={isJoined ? 'Înscris' : ch.difficulty}
                          size="small"
                          sx={{
                            bgcolor: isJoined ? '#ecfdf5' : '#f0f7ff',
                            color: isJoined ? '#10b981' : '#1a6fff',
                            fontWeight: 700, fontSize: '0.68rem',
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">Nu există provocări active</Typography>
                  <Button size="small" variant="outlined" component={Link} to={ROUTES.CHALLENGES} sx={{ mt: 1, borderRadius: 2 }}>
                    Explorează
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Pași următori */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>🚀 Pași următori</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {completedSteps} din {PROGRESS_STEPS.length} completați
                  </Typography>
                </Box>
                <Chip label={`${progressPct}%`}
                      sx={{ bgcolor: progressPct === 100 ? '#ecfdf5' : '#f0f7ff', color: progressPct === 100 ? '#10b981' : '#1a6fff', fontWeight: 800, fontSize: '0.85rem' }} />
              </Box>
              <LinearProgress variant="determinate" value={progressPct}
                              sx={{ mb: 2.5, height: 6, borderRadius: 3, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: progressPct === 100 ? '#10b981' : '#1a6fff', borderRadius: 3 } }} />
              <List disablePadding>
                {PROGRESS_STEPS.map((step) => {
                  const done = progress[step.key];
                  return (
                    <ListItem key={step.key} disablePadding
                              component={done ? 'div' : Link}
                              to={done ? undefined : step.link}
                              sx={{ py: 0.75, borderRadius: 1, px: 1, textDecoration: 'none', '&:hover': !done ? { bgcolor: '#f0f7ff' } : {} }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {done
                          ? <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                          : <RadioButtonUnchecked sx={{ color: '#cbd5e1', fontSize: 20 }} />
                        }
                      </ListItemIcon>
                      <ListItemText
                          primary={step.label}
                          secondary={done ? 'Completat' : step.desc}
                          slotProps={{
                            primary: { style: { fontSize: '0.875rem', fontWeight: done ? 400 : 600, textDecoration: done ? 'line-through' : 'none', color: done ? '#94a3b8' : '#0f172a' } },
                            secondary: { style: { fontSize: '0.72rem', color: done ? '#10b981' : '#94a3b8' } },
                          }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Activitate recentă + Sumar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Activitate recentă — din API */}
        <Box sx={{ flex: '2 1 400px', minWidth: 0 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={800}>📋 Activitate recentă</Typography>
                <Button size="small" endIcon={<ArrowForward />} component={Link} to={ROUTES.ACTIVITIES} sx={{ fontWeight: 700 }}>Toate</Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={56} />)}
                </Box>
              ) : activities.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>🏃</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Nu există activități înregistrate</Typography>
                  <Button variant="outlined" size="small" component={Link} to={ROUTES.ACTIVITIES} sx={{ borderRadius: 2, mt: 1 }}>Adaugă activitate</Button>
                </Box>
              ) : (
                <List disablePadding>
                  {activities.slice(0, 5).map((act, i) => (
                    <React.Fragment key={act.id}>
                      <ListItem disablePadding sx={{ py: 1.25 }}>
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                            {ACTIVITY_ICONS[act.type] ?? '🏋️'}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary={act.name}
                            secondary={`${act.type} · ${act.duration} · ${act.calories} kcal · ${act.distance} km`}
                            slotProps={{
                              primary: { style: { fontSize: '0.875rem', fontWeight: 700 } },
                              secondary: { style: { fontSize: '0.75rem' } },
                            }}
                        />
                      </ListItem>
                      {i < Math.min(activities.length, 5) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Sumar */}
        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5 }}>📊 Sumarul meu</Typography>
              {[
                { label: 'Cluburi înscrise',    value: loading ? '—' : cluburiJoinedCount,   icon: '👥', link: ROUTES.CLUBS },
                { label: 'Provocări active',    value: loading ? '—' : joinedChallengeIds.length, icon: '🏆', link: ROUTES.CHALLENGES },
                { label: 'Evenimente totale',   value: loading ? '—' : events.length,        icon: '📅', link: ROUTES.EVENTS_DASHBOARD },
                { label: 'Total activități',    value: loading ? '—' : activities.length,    icon: '🏃', link: ROUTES.ACTIVITIES },
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
                      {loading
                        ? <Skeleton variant="text" width={24} />
                        : <Typography variant="body1" fontWeight={900} color="#0f172a">{item.value}</Typography>
                      }
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
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
