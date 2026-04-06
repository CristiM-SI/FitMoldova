import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip, IconButton,
  Divider, LinearProgress, Tabs, Tab, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, CircularProgress, Alert,
} from '@mui/material';
import { Add, Close, DirectionsRun, LocalFireDepartment, Straighten } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useProgress } from '../../context/ProgressContext';
import { useDashboardData } from '../../context/useDashboardData';
import { useAuth } from '../../context/AuthContext';
import { activityApi, type ActivityDto, type ActivityCreatePayload } from '../../services/API/activityApi';


const TYPE_COLORS: Record<string, string> = {
  Alergare: '#3b82f6', Ciclism: '#10b981', Inot: '#06b6d4',
  Fitness: '#f59e0b', Yoga: '#a855f7', Trail: '#84cc16',
  'Mers pe jos': '#f97316',
};

const ACTIVITY_TYPES = ['Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Inot', 'Trail', 'Mers pe jos'];

const EMPTY_FORM: Omit<ActivityCreatePayload, 'userId'> = {
  name: '', type: 'Alergare', distance: '', duration: '',
  calories: 0, date: new Date().toISOString().slice(0, 10),
  description: '', imageUrl: '',
};

const Activitati: React.FC = () => {
  const { completeFirstActivity } = useProgress();
  const { activitatiCurente, addActivitate, removeActivitate } = useDashboardData();
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState(0);

  // ── Date din backend ──────────────────────────────────────────────────────
  const [apiActivities, setApiActivities] = useState<ActivityDto[]>([]);
  const [loadingApi, setLoadingApi]       = useState(false);
  const [apiError, setApiError]           = useState<string | null>(null);

  const fetchActivities = () => {
    setLoadingApi(true);
    setApiError(null);
    activityApi.getAll()
      .then(data => setApiActivities(data ?? []))
      .catch(err => setApiError(err instanceof Error ? err.message : 'Eroare server'))
      .finally(() => setLoadingApi(false));
  };

  useEffect(() => { fetchActivities(); }, []);

  // ── Modal creare (doar admin) ─────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const openModal = () => { setFormData(EMPTY_FORM); setFormError(null); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleField = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = field === 'calories' ? Number(e.target.value) : e.target.value;
      setFormData(prev => ({ ...prev, [field]: val }));
    };

  const handleCreate = async () => {
    if (!formData.name.trim()) { setFormError('Numele activității este obligatoriu.'); return; }
    if (!user) { setFormError('Nu ești autentificat.'); return; }
    setSaving(true);
    setFormError(null);
    try {
      const payload: ActivityCreatePayload = { ...formData, userId: user.id };
        const createdId = await activityApi.create(payload);

        const created: ActivityDto = {
            id: createdId,
            name: payload.name,
            type: payload.type,
            distance: payload.distance,
            duration: payload.duration,
            calories: payload.calories,
            date: payload.date,
            description: payload.description,
            imageUrl: payload.imageUrl,
            createdBy: user?.id?.toString() || '',
            participantsCount: 0,
        };

        setApiActivities(prev => [created, ...prev]);
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Eroare la creare.');
    } finally {
      setSaving(false);
    }
  };

  // ── Filtrare recomandări (exclude ce a adăugat deja userul, după nume) ────
  const addedNames = useMemo(
    () => new Set(activitatiCurente.map(a => a.name)),
    [activitatiCurente]
  );

  const recommendations = useMemo(
    () => apiActivities.filter(a => !addedNames.has(a.name)),
    [apiActivities, addedNames]
  );

  // ── Adaugă în lista personală ─────────────────────────────────────────────
  const adaugaActivitate = (act: ActivityDto) => {
    addActivitate({
      id: act.id,
      name: act.name,
      type: act.type,
      distance: act.distance,
      duration: act.duration,
      calories: act.calories,
      date: act.date,
    });
    completeFirstActivity();
  };

  // ── Statistici ────────────────────────────────────────────────────────────
  const { totalCalories, totalDist } = useMemo(() => ({
    totalCalories: activitatiCurente.reduce((s, a) => s + a.calories, 0),
    totalDist: activitatiCurente.reduce((s, a) => s + (parseFloat(a.distance) || 0), 0),
  }), [activitatiCurente]);

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0f172a">Activitati</Typography>
          <Typography variant="body2" color="text.secondary">Gestioneaza activitatile tale sportive</Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<Add />} onClick={openModal}
            sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#1a6fff', '&:hover': { bgcolor: '#1558d6' } }}>
            Adaugă activitate
          </Button>
        )}
      </Box>

      {/* Eroare API */}
      {apiError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
          {apiError} — Recomandările nu s-au putut încărca din backend.
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {[
          { label: 'Activitati Inregistrate', value: activitatiCurente.length, Icon: DirectionsRun, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Distanta Totala', value: `${totalDist.toFixed(1)} km`, Icon: Straighten, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Calorii Arse', value: totalCalories, Icon: LocalFireDepartment, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Recomandari Disponibile', value: recommendations.length, Icon: Add, color: '#a855f7', bg: '#fdf4ff' },
        ].map((s) => (
          <Box key={s.label} sx={{ flex: '1 1 180px', minWidth: 0 }}>
            <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.Icon sx={{ color: s.color, fontSize: 16 }} />
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
        <Box sx={{ borderBottom: '1px solid #e8edf3' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Activitatile Mele
                <Chip label={activitatiCurente.length} size="small"
                  sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#f0f7ff', color: '#1a6fff', fontWeight: 800 }} />
              </Box>
            } sx={{ fontWeight: 700, textTransform: 'none' }} />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Recomandari
                {loadingApi
                  ? <CircularProgress size={12} />
                  : <Chip label={recommendations.length} size="small"
                      sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 800 }} />
                }
              </Box>
            } sx={{ fontWeight: 700, textTransform: 'none' }} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Tab: Activitatile Mele */}
          {tab === 0 && (
            <>
              {activitatiCurente.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>🏃</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                    Nicio activitate inregistrata
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Mergi la tab-ul Recomandari si adauga activitati!
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {activitatiCurente.map((act) => (
                      <Paper key={act.id} elevation={0} sx={{
                        p: 2, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3',
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                          bgcolor: `${TYPE_COLORS[act.type] || '#6366f1'}12`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
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

                  <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #f0f4f8', display: 'flex', gap: 0 }}>
                    {[
                      { label: 'Total activitati', value: activitatiCurente.length },
                      { label: 'Calorii', value: totalCalories },
                      { label: 'Distanta', value: `${totalDist.toFixed(1)} km` },
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
                </>
              )}
            </>
          )}

          {/* Tab: Recomandari */}
          {tab === 1 && (
            <>
              {loadingApi ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Se încarcă activitățile...</Typography>
                </Box>
              ) : recommendations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>🎉</Typography>
                  <Typography variant="body2" fontWeight={700} color="#10b981" gutterBottom>
                    {apiActivities.length === 0 ? 'Nicio activitate în backend.' : 'Ai adăugat toate activitățile!'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isAdmin ? 'Adaugă activități noi cu butonul de sus.' : 'Felicitări pentru activism!'}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Activități din comunitatea FitMoldova
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {recommendations.map((rec, i) => (
                      <React.Fragment key={rec.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.75 }}>
                          <Box sx={{
                            width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                            bgcolor: `${TYPE_COLORS[rec.type] || '#6366f1'}10`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <DirectionsRun sx={{ color: TYPE_COLORS[rec.type] || '#6366f1', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>{rec.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.25, flexWrap: 'wrap' }}>
                              <Chip label={rec.type} size="small"
                                sx={{ height: 18, fontSize: '0.65rem', bgcolor: `${TYPE_COLORS[rec.type] || '#6366f1'}10`, color: TYPE_COLORS[rec.type] || '#6366f1', fontWeight: 700 }} />
                              <Typography variant="caption" color="text.secondary">{rec.duration} · {rec.calories} kcal</Typography>
                              {rec.distance && <Typography variant="caption" color="text.secondary">· {rec.distance}</Typography>}
                            </Box>
                            {rec.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }} noWrap>
                                {rec.description}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                            <Button size="small" variant="outlined" startIcon={<Add />}
                              onClick={() => adaugaActivitate(rec)}
                              sx={{ borderRadius: 2, whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
                              Adaugă
                            </Button>
                            {isAdmin && (
                              <Button size="small" color="error" variant="text"
                                onClick={async () => {
                                  await activityApi.delete(rec.id);
                                  setApiActivities(prev => prev.filter(a => a.id !== rec.id));
                                }}
                                sx={{ fontSize: '0.65rem', p: '2px 6px', minWidth: 0 }}>
                                Șterge
                              </Button>
                            )}
                          </Box>
                        </Box>
                        {i < recommendations.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Distribuție pe tip */}
      {activitatiCurente.length > 0 && (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>📊 Distributie pe tip de activitate</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(
                activitatiCurente.reduce<Record<string, number>>((acc, a) => {
                  acc[a.type] = (acc[a.type] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => {
                const pct = Math.round((count / activitatiCurente.length) * 100);
                const color = TYPE_COLORS[type] || '#6366f1';
                return (
                  <Box key={type} sx={{ flex: '1 1 200px', p: 2, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e8edf3' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={700}>{type}</Typography>
                      <Typography variant="body2" fontWeight={900} color={color}>{count} activit.</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct}
                      sx={{ height: 6, borderRadius: 3, bgcolor: `${color}15`, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{pct}% din total</Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Modal creare activitate (doar admin) */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Adaugă activitate nouă</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {formError && <Alert severity="error" onClose={() => setFormError(null)}>{formError}</Alert>}

          <TextField label="Nume activitate *" value={formData.name} onChange={handleField('name')} fullWidth size="small" />

          <TextField select label="Tip activitate" value={formData.type} onChange={handleField('type')} fullWidth size="small">
            {ACTIVITY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Distanță (ex: 5 km)" value={formData.distance} onChange={handleField('distance')} fullWidth size="small" />
            <TextField label="Durată (ex: 30 min)" value={formData.duration} onChange={handleField('duration')} fullWidth size="small" />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Calorii" type="number" value={formData.calories} onChange={handleField('calories')} fullWidth size="small" inputProps={{ min: 0 }} />
            <TextField label="Dată" type="date" value={formData.date} onChange={handleField('date')} fullWidth size="small" InputLabelProps={{ shrink: true }} />
          </Box>

          <TextField label="Descriere" value={formData.description} onChange={handleField('description')} fullWidth size="small" multiline rows={2} />
          <TextField label="URL imagine (opțional)" value={formData.imageUrl} onChange={handleField('imageUrl')} fullWidth size="small" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeModal} disabled={saving}>Anulează</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}
            sx={{ bgcolor: '#1a6fff', '&:hover': { bgcolor: '#1558d6' } }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Creează'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Activitati;