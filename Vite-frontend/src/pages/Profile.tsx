import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Grid, Button, Avatar, Chip,
    TextField, Snackbar, Alert, Divider, Paper, LinearProgress,
} from '@mui/material';
import { Edit, Save, Cancel, Person, Info, Email, CheckCircle } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { useDashboardData } from '../context/useDashboardData';
import { ROUTES } from '../routes/paths';

const AVATAR_COLORS = ['#1a6fff', '#00c8a0', '#f59e0b', '#ef4444', '#8b5cf6'];

function getInitials(f: string, l: string) {
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
}

function getAvatarColor(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const Profile: React.FC = () => {
    const { user: authUser } = useAuth();
    const { user, updateUser } = useUser();
    const { completeProfile, progress } = useProgress();
    const { activitatiCurente, provocariInscrise, cluburiJoined } = useDashboardData();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const [editData, setEditData] = useState({
        firstName: user?.firstName || authUser?.firstName || '',
        lastName: user?.lastName || authUser?.lastName || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
    });

    if (!authUser) {
        return (
            <DashboardLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', p: 4, textAlign: 'center', maxWidth: 400 }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom>Nu ești autentificat</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Trebuie să creezi un cont pentru a vedea profilul.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate(ROUTES.REGISTER)} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                            Creează cont
                        </Button>
                    </Card>
                </Box>
            </DashboardLayout>
        );
    }

    const displayFirstName = user?.firstName || authUser.firstName;
    const displayLastName = user?.lastName || authUser.lastName;
    const displayEmail = user?.email || authUser.email;
    const avatarColor = getAvatarColor(displayFirstName + displayLastName);
    const initials = getInitials(displayFirstName, displayLastName);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        updateUser(editData);
        setIsEditing(false);
        setSaved(true);
        if (editData.phone || editData.location || editData.bio) completeProfile();
    };

    const handleCancel = () => {
        setEditData({
            firstName: user?.firstName || authUser.firstName,
            lastName: user?.lastName || authUser.lastName,
            phone: user?.phone || '',
            location: user?.location || '',
            bio: user?.bio || '',
        });
        setIsEditing(false);
    };

    // Progress bar for profile completion
    const completionFields = [editData.firstName, editData.lastName, displayEmail, editData.phone, editData.location, editData.bio];
    const profileCompletion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={800} color="#0f172a">Profil</Typography>
                    <Typography variant="body2" color="text.secondary">Gestionează informațiile tale personale</Typography>
                </Box>
                {!isEditing ? (
                    <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)} sx={{ borderRadius: 2 }}>
                        Editează
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} sx={{ borderRadius: 2 }}>Anulează</Button>
                        <Button variant="contained" startIcon={<Save />} onClick={handleSave} sx={{ borderRadius: 2, boxShadow: 'none' }}>Salvează</Button>
                    </Box>
                )}
            </Box>

            {/* Stats — 4 full row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Activități', value: activitatiCurente.length, emoji: '🏃', bg: '#f0f7ff' },
                    { label: 'Provocări', value: provocariInscrise.length, emoji: '🏆', bg: '#fffbeb' },
                    { label: 'Cluburi', value: cluburiJoined.length, emoji: '👥', bg: '#ecfdf5' },
                    { label: 'Profil completat', value: `${profileCompletion}%`, emoji: '⭐', bg: '#fdf4ff' },
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

            {/* Hero Banner */}
            <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: '1px solid #e8edf3' }}>
                <Box sx={{ height: 130, background: 'linear-gradient(135deg, #0f172a 0%, #1a6fff 50%, #0ea5e9 100%)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: -20, top: -20, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
                </Box>
                <Box sx={{ px: 3, pb: 3, position: 'relative' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: avatarColor, fontSize: '1.5rem', fontWeight: 900, border: '4px solid #fff', mt: -5, mb: 1.5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        {initials}
                    </Avatar>

                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                            <TextField name="firstName" size="small" label="Prenume" value={editData.firstName} onChange={handleChange}
                                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                            <TextField name="lastName" size="small" label="Nume" value={editData.lastName} onChange={handleChange}
                                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Box>
                    ) : (
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>{displayFirstName} {displayLastName}</Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary">✉️ {displayEmail}</Typography>
                        <Chip icon={<CheckCircle sx={{ fontSize: '14px !important', color: '#10b981 !important' }} />}
                              label="Membru activ" size="small"
                              sx={{ height: 22, bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }} />
                    </Box>

                    {/* Profile completion bar */}
                    <Box sx={{ mt: 2.5, maxWidth: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Completare profil</Typography>
                            <Typography variant="caption" fontWeight={800} color="#1a6fff">{profileCompletion}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={profileCompletion}
                                        sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: profileCompletion === 100 ? '#10b981' : '#1a6fff', borderRadius: 3 } }} />
                    </Box>
                </Box>
            </Paper>

            {/* Info Grid */}
            <Grid container spacing={2}>
                {/* Personal Info */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                <Person sx={{ color: '#1a6fff', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={800}>Informații personale</Typography>
                            </Box>
                            {[
                                { label: 'Prenume', name: 'firstName', value: displayFirstName, editable: true },
                                { label: 'Nume', name: 'lastName', value: displayLastName, editable: true },
                                { label: 'Email', name: 'email', value: displayEmail, editable: false },
                                { label: 'Telefon', name: 'phone', value: user?.phone || '', placeholder: '+373 xxx xxx xxx', editable: true },
                                { label: 'Locație', name: 'location', value: user?.location || '', placeholder: 'ex: Chișinău, Moldova', editable: true },
                            ].map((field, i) => (
                                <React.Fragment key={field.name}>
                                    {i > 0 && <Divider sx={{ my: 1.5 }} />}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{field.label}</Typography>
                                        {isEditing && field.editable && field.name !== 'email' ? (
                                            <TextField fullWidth size="small" name={field.name}
                                                       value={editData[field.name as keyof typeof editData] ?? ''}
                                                       onChange={handleChange} placeholder={field.placeholder}
                                                       sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                        ) : (
                                            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
                                                {field.value || <Box component="span" sx={{ color: '#94a3b8', fontWeight: 400, fontStyle: 'italic' }}>Necompletat</Box>}
                                            </Typography>
                                        )}
                                    </Box>
                                </React.Fragment>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* About */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                <Info sx={{ color: '#1a6fff', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={800}>Despre mine</Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Bio</Typography>
                                {isEditing ? (
                                    <TextField fullWidth multiline rows={3} size="small" name="bio" value={editData.bio}
                                               onChange={handleChange} placeholder="Spune ceva despre tine..."
                                               sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                ) : (
                                    <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.7 }}>
                                        {user?.bio || <Box component="span" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>Nicio descriere adăugată.</Box>}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2.5 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Membru din</Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>{user?.joinDate || '—'}</Typography>
                            </Box>

                            {/* Activity stats */}
                            <Box sx={{ bgcolor: '#f8faff', borderRadius: 2, border: '1px solid #e8edf3', overflow: 'hidden' }}>
                                {[
                                    { label: 'Activități înregistrate', value: activitatiCurente.length, emoji: '🏃' },
                                    { label: 'Provocări active', value: provocariInscrise.length, emoji: '🏆' },
                                    { label: 'Cluburi înscrise', value: cluburiJoined.length, emoji: '👥' },
                                ].map((s, i) => (
                                    <React.Fragment key={s.label}>
                                        {i > 0 && <Divider />}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                                            <Typography variant="body2" color="text.secondary">{s.emoji} {s.label}</Typography>
                                            <Typography variant="body2" fontWeight={900} color="#1a6fff">{s.value}</Typography>
                                        </Box>
                                    </React.Fragment>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>✅ Profilul a fost actualizat cu succes!</Alert>
            </Snackbar>
        </DashboardLayout>
    );
};

export default Profile;
