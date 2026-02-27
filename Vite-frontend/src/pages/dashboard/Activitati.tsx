import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, IconButton,
  Alert, Divider, Avatar, LinearProgress, Paper,
} from '@mui/material';
import { Add, Close, DirectionsRun, LocalFireDepartment, Timer, Straighten } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout.tsx';
import { useProgress } from '../../context/ProgressContext.tsx';
import { useDashboardData } from '../../context/useDashboardData.ts';
import { MOCK_ACTIVITATI } from '../../services/mock/activitati.ts';

const TYPE_COLORS: Record<string, string> = {
  Alergare: '#3b82f6', Ciclism: '#10b981', Înot: '#06b6d4',
  Fitness: '#f59e0b', Yoga: '#a855f7', Trail: '#84cc16',
};

const Activitati: React.FC = () => {
  const { completeFirstActivity } = useProgress();
  const { activitatiCurente, activitatiDisponibile: recomandari, addActivitate, removeActivitate } = useDashboardData();

  const adaugaActivitate = (activitate: typeof recomandari[0]) => {
    addActivitate(activitate);
    completeFirstActivity();
  };

  const totalCalories = activitatiCurente.reduce((s, a) => s + a.calories, 0);
  const totalDist = activitatiCurente.reduce((s, a) => s + (parseFloat(a.distance) || 0), 0);

  return (
      <DashboardLayout>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#0f172a">Activități</Typography>
          <Typography variant="body2" color="text.secondary">Gestionează activitățile tale sportive</Typography>
        </Box>

        {/* Stats — 4 cards full row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Activități Înregistrate', value: activitatiCurente.length, icon: <DirectionsRun />, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Distanță Totală', value: `${totalDist.toFixed(1)} km`, icon: <Straighten />, color: '#10b981', bg: '#ecfdf5' },
            { label: 'Calorii Arse', value: totalCalories, icon: <LocalFireDepartment />, color: '#ef4444', bg: '#fef2f2' },
            { label: 'Recomandări Disponibile', value: recomandari.length, icon: <Add />, color: '#a855f7', bg: '#fdf4ff' },
          ].map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: `${s.color}20` }}>
                        {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 16 } })}
                      </Avatar>
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>

        {/* Two column layout: current activities + recommendations */}
        <Grid container spacing={3}>
          {/* Left: Current activities */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800}>Activitățile Tale Curente</Typography>
                  <Chip label={`${activitatiCurente.length} total`} size="small"
                        sx={{ bgcolor: '#f0f7ff', color: '#1a6fff', fontWeight: 700, fontSize: '0.72rem' }} />
                </Box>

                {activitatiCurente.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="h3" sx={{ mb: 1 }}>🏃</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                        Nicio activitate înregistrată
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Adaugă activități din lista de recomandări!
                      </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {activitatiCurente.map((act) => (
                          <Paper key={act.id} elevation={0} sx={{
                            p: 2, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3',
                            display: 'flex', alignItems: 'center', gap: 2,
                          }}>
                            <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: `${TYPE_COLORS[act.type] || '#6366f1'}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <DirectionsRun sx={{ color: TYPE_COLORS[act.type] || '#6366f1', fontSize: 22 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={700} noWrap>{act.name}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                <Chip label={act.type} size="small"
                                      sx={{ height: 18, fontSize: '0.65rem', bgcolor: `${TYPE_COLORS[act.type] || '#6366f1'}12`, color: TYPE_COLORS[act.type] || '#6366f1', fontWeight: 700 }} />
                                <Typography variant="caption" color="text.secondary">⏱ {act.duration}</Typography>
                                <Typography variant="caption" color="text.secondary">🔥 {act.calories} kcal</Typography>
                                {act.distance && <Typography variant="caption" color="text.secondary">📍 {act.distance}</Typography>}
                              </Box>
                            </Box>
                            <IconButton size="small" onClick={() => removeActivitate(act.id)}
                                        sx={{ color: '#94a3b8', flexShrink: 0, '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}>
                              <Close fontSize="small" />
                            </IconButton>
                          </Paper>
                      ))}
                    </Box>
                )}

                {/* Mini stats bar at bottom */}
                {activitatiCurente.length > 0 && (
                    <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #f0f4f8', display: 'flex', gap: 0 }}>
                      {[
                        { label: 'Total activități', value: activitatiCurente.length },
                        { label: 'Calorii', value: totalCalories },
                        { label: 'Distanță', value: `${totalDist.toFixed(1)} km` },
                      ].map((s, i) => (
                          <React.Fragment key={s.label}>
                            {i > 0 && <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />}
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="body1" fontWeight={900} color="#1a6fff">{s.value}</Typography>
                              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                            </Box>
                          </React.Fragment>
                      ))}
                    </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Recommendations */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={800}>Recomandări</Typography>
                  <Chip label={`${recomandari.length} disponibile`} size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.72rem' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Activități populare din comunitatea FitMoldova
                </Typography>

                {recomandari.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="h3" sx={{ mb: 1 }}>🎉</Typography>
                      <Typography variant="body2" fontWeight={700} color="#10b981" gutterBottom>
                        Ai adăugat toate recomandările!
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Felicitări pentru activismul tău!
                      </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {recomandari.map((rec, i) => (
                          <React.Fragment key={rec.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.75 }}>
                              <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: `${TYPE_COLORS[rec.type] || '#6366f1'}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <DirectionsRun sx={{ color: TYPE_COLORS[rec.type] || '#6366f1', fontSize: 20 }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={700} noWrap>{rec.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
                                  <Chip label={rec.type} size="small"
                                        sx={{ height: 18, fontSize: '0.65rem', bgcolor: `${TYPE_COLORS[rec.type] || '#6366f1'}10`, color: TYPE_COLORS[rec.type] || '#6366f1', fontWeight: 700 }} />
                                  <Typography variant="caption" color="text.secondary">{rec.duration} · {rec.calories} kcal</Typography>
                                </Box>
                              </Box>
                              <Button size="small" variant="outlined" startIcon={<Add />}
                                      onClick={() => adaugaActivitate(rec)}
                                      sx={{ borderRadius: 2, whiteSpace: 'nowrap', fontSize: '0.72rem', flexShrink: 0 }}>
                                Adaugă
                              </Button>
                            </Box>
                            {i < recomandari.length - 1 && <Divider />}
                          </React.Fragment>
                      ))}
                    </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Full-width type breakdown */}
        {activitatiCurente.length > 0 && (
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>📊 Distribuție pe tip de activitate</Typography>
                <Grid container spacing={2}>
                  {Object.entries(
                      activitatiCurente.reduce<Record<string, number>>((acc, a) => {
                        acc[a.type] = (acc[a.type] || 0) + 1;
                        return acc;
                      }, {})
                  ).map(([type, count]) => {
                    const pct = Math.round((count / activitatiCurente.length) * 100);
                    const color = TYPE_COLORS[type] || '#6366f1';
                    return (
                        <Grid item xs={12} sm={6} md={4} key={type}>
                          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" fontWeight={700}>{type}</Typography>
                              <Typography variant="body2" fontWeight={900} color={color}>{count} activit.</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={pct}
                                            sx={{ height: 6, borderRadius: 3, bgcolor: `${color}15`, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{pct}% din total</Typography>
                          </Box>
                        </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
        )}
      </DashboardLayout>
  );
};

export default Activitati;
