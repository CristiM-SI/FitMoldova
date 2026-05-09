import React, { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { Card, Descriptions, Button, Spin, Alert, Tag, Space, Typography, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Navbar from '../components/layout/Navbar';
import { eventApi, type EventDto } from '../services/api/eventApi';
import { clubApi, type ClubDto } from '../services/api/clubApi';
import { challengeApi, type ChallengeDto } from '../services/api/challengeApi';
import { useDashboardData } from '../context/useDashboardData';
import { useAuth } from '../context/AuthContext';

export type EntityType = 'event' | 'club' | 'challenge';

type EntityData = EventDto | ClubDto | ChallengeDto;

const ENTITY_LABELS: Record<EntityType, { label: string; color: string }> = {
    event:     { label: 'Eveniment', color: 'blue' },
    club:      { label: 'Club',      color: 'green' },
    challenge: { label: 'Provocare', color: 'orange' },
};

function buildDescriptions(entity: EntityType, data: EntityData): { label: string; value: React.ReactNode }[] {
    if (entity === 'event') {
        const d = data as EventDto;
        return [
            { label: 'Descriere',      value: d.description || '—' },
            { label: 'Dată',           value: d.date ? new Date(d.date).toLocaleDateString('ro-RO') : '—' },
            { label: 'Locație',        value: d.location || '—' },
            { label: 'Oraș',           value: d.city || '—' },
            { label: 'Categorie',      value: <Tag color="blue">{d.category}</Tag> },
            { label: 'Dificultate',    value: <Tag color="orange">{d.difficulty}</Tag> },
            { label: 'Participanți',   value: `${d.participants} / ${d.maxParticipants}` },
            { label: 'Preț',           value: d.price || 'Gratuit' },
            { label: 'Organizator',    value: d.organizer || '—' },
        ];
    }
    if (entity === 'club') {
        const d = data as ClubDto;
        return [
            { label: 'Descriere',  value: d.description || '—' },
            { label: 'Categorie',  value: <Tag color="green">{d.category}</Tag> },
            { label: 'Nivel',      value: d.level || '—' },
            { label: 'Locație',    value: d.location || '—' },
            { label: 'Program',    value: d.schedule || '—' },
            { label: 'Membri',     value: (d.membersCount ?? 0).toLocaleString() },
            { label: 'Rating',     value: d.rating != null ? `${d.rating} / 5` : '—' },
        ];
    }
    // challenge
    const d = data as ChallengeDto;
    return [
        { label: 'Descriere',    value: d.description || '—' },
        { label: 'Durată',       value: d.duration || '—' },
        { label: 'Dificultate',  value: <Tag color="red">{d.difficulty}</Tag> },
        { label: 'Participanți', value: d.participants ?? 0 },
    ];
}

interface Props {
    entity: EntityType;
}

export default function DetailPage({ entity }: Props) {
    const rawParams = useParams({ strict: false }) as Record<string, string | undefined>;
    const id = Number(rawParams.id ?? 0);
    const { isAuthenticated } = useAuth();
    const {
        joinedEventIds, joinedChallengeIds, userClubs,
        joinEvent, leaveEvent, joinClub, leaveClub, joinChallenge, leaveChallenge,
    } = useDashboardData();

    const [data, setData]             = useState<EntityData | null>(null);
    const [loading, setLoading]       = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [actionBusy, setActionBusy] = useState(false);
    const [actionMsg, setActionMsg]   = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setFetchError(null);

        const promise: Promise<EntityData> =
            entity === 'event'     ? eventApi.getById(id) :
            entity === 'club'      ? clubApi.getById(id)  :
                                     challengeApi.getById(id);

        promise
            .then(setData)
            .catch((e: Error) => setFetchError(e.message || 'Nu s-au putut încărca datele.'))
            .finally(() => setLoading(false));
    }, [entity, id]);

    const isJoined =
        entity === 'event'     ? joinedEventIds.includes(id) :
        entity === 'club'      ? userClubs.some(c => c.id === id) :
                                 joinedChallengeIds.includes(id);

    const handleJoin = async () => {
        if (!isAuthenticated) { setActionMsg({ text: 'Trebuie să fii autentificat.', ok: false }); return; }
        setActionBusy(true);
        try {
            if (entity === 'event')          await joinEvent(id);
            else if (entity === 'club')      await joinClub(id);
            else                             await joinChallenge(id);
            setActionMsg({ text: 'Te-ai alăturat cu succes! 🎉', ok: true });
        } catch (e: unknown) {
            setActionMsg({ text: e instanceof Error ? e.message : 'Eroare la înscriere.', ok: false });
        } finally {
            setActionBusy(false);
        }
    };

    const handleLeave = async () => {
        setActionBusy(true);
        try {
            if (entity === 'event')          await leaveEvent(id);
            else if (entity === 'club')      await leaveClub(id);
            else                             await leaveChallenge(id);
            setActionMsg({ text: 'Ai ieșit cu succes.', ok: true });
        } catch (e: unknown) {
            setActionMsg({ text: e instanceof Error ? e.message : 'Eroare la ieșire.', ok: false });
        } finally {
            setActionBusy(false);
        }
    };

    const cfg = ENTITY_LABELS[entity];

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff' }}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => window.history.back()}
                    style={{ marginBottom: '1.5rem' }}
                >
                    Înapoi
                </Button>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spin size="large" />
                    </div>
                )}

                {fetchError && !loading && (
                    <Alert type="error" message={fetchError} showIcon style={{ marginBottom: '1rem' }} />
                )}

                {data && !loading && (
                    <Card
                        title={
                            <Space>
                                <Tag color={cfg.color}>{cfg.label}</Tag>
                                <Typography.Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                                    {data.name}
                                </Typography.Title>
                            </Space>
                        }
                        extra={
                            isAuthenticated ? (
                                isJoined ? (
                                    <Button danger loading={actionBusy} onClick={handleLeave}>
                                        Ieși
                                    </Button>
                                ) : (
                                    <Button type="primary" loading={actionBusy} onClick={handleJoin}>
                                        Alătură-te
                                    </Button>
                                )
                            ) : null
                        }
                        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    >
                        {actionMsg && (
                            <Alert
                                message={actionMsg.text}
                                type={actionMsg.ok ? 'success' : 'error'}
                                showIcon
                                closable
                                onClose={() => setActionMsg(null)}
                                style={{ marginBottom: '1rem' }}
                            />
                        )}
                        <Divider />
                        <Descriptions
                            column={{ xs: 1, sm: 2 }}
                            bordered
                            size="small"
                        >
                            {buildDescriptions(entity, data).map(item => (
                                <Descriptions.Item key={item.label} label={item.label}>
                                    {item.value}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Card>
                )}
            </div>
        </div>
    );
}
