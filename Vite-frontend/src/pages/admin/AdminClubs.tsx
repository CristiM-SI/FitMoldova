import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Rate, Row, Col, Spin, Alert, Upload, Image as AntImage,
    DatePicker, ConfigProvider,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, TeamOutlined, ReloadOutlined,
    UploadOutlined, LinkOutlined, DeleteFilled, CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile } from 'antd/es/upload';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ro';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import roRO from 'antd/locale/ro_RO';
import { clubApi, type ClubDto, type ClubCreatePayload, type ClubUpdatePayload } from '../../services/api/clubApi';

// Activează plugin-ul pentru a parsa formate custom (la editare).
dayjs.extend(customParseFormat);
dayjs.locale('ro');

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = ['Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'];
const LEVELS     = ['Începător', 'Intermediar', 'Avansat', 'Toate'];
const MAX_IMAGE_MB = 2;

const CATEGORY_COLORS: Record<string, string> = {
    Alergare: 'blue', Ciclism: 'green', Fitness: 'orange',
    Yoga: 'purple', Înot: 'cyan', Trail: 'lime',
};
const LEVEL_COLORS: Record<string, string> = {
    Începător: 'green', Intermediar: 'orange', Avansat: 'red', Toate: 'blue',
};

// Format în care salvăm programul în DB (string human-readable + parsabil înapoi).
// Ex: „sâmbătă, 20 aprilie 2026, 08:00"
const SCHEDULE_STORAGE_FORMAT = 'dddd, D MMMM YYYY, HH:mm';

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Nu s-a putut citi fișierul.'));
        reader.readAsDataURL(file);
    });
}

/** Încearcă să parseze un string de program în Dayjs. Returnează null dacă nu poate. */
function parseSchedule(raw: string): Dayjs | null {
    if (!raw) return null;
    // Încearcă formatul nostru standard
    const d1 = dayjs(raw, SCHEDULE_STORAGE_FORMAT, 'ro', true);
    if (d1.isValid()) return d1;
    // Fallback: ISO
    const d2 = dayjs(raw);
    if (d2.isValid() && /\d{4}-\d{2}-\d{2}/.test(raw)) return d2;
    return null;
}

const AdminClubs: React.FC = () => {
    const [clubs, setClubs]         = useState<ClubDto[]>([]);
    const [loading, setLoading]     = useState(false);
    const [saving, setSaving]       = useState(false);
    const [apiError, setApiError]   = useState<string | null>(null);
    const [search, setSearch]       = useState('');
    const [filterCat, setFilterCat] = useState<string>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ClubDto | null>(null);
    const [form]                    = Form.useForm();
    const [messageApi, ctxHolder]   = message.useMessage();

    // Imagine — stare separată pentru preview live
    const [imageSrc, setImageSrc] = useState<string>('');
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

    // Program — ținem separat textul original (pentru programe vechi care nu-s date)
    const [scheduleFallback, setScheduleFallback] = useState<string>('');

    const fetchClubs = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const data = await clubApi.getAll();
            setClubs(data ?? []);
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : 'Nu s-a putut conecta la server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchClubs(); }, [fetchClubs]);

    const filtered = clubs.filter(c => {
        const term = search.toLowerCase();
        const matchSearch =
            c.name.toLowerCase().includes(term) ||
            c.location.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term);
        const matchCat = filterCat === 'all' || c.category === filterCat;
        return matchSearch && matchCat;
    });

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setImageSrc('');
        setImageMode('url');
        setScheduleFallback('');
        setModalOpen(true);
    };

    const openEdit = (record: ClubDto) => {
        setEditTarget(record);
        const parsedSchedule = parseSchedule(record.schedule);
        form.setFieldsValue({
            name:        record.name,
            category:    record.category,
            location:    record.location,
            description: record.description,
            schedule:    parsedSchedule,  // Dayjs | null pentru DatePicker
            level:       record.level,
            rating:      record.rating,
        });
        setImageSrc(record.imageUrl || '');
        setImageMode(record.imageUrl?.startsWith('data:') ? 'upload' : 'url');
        // Dacă programul vechi nu s-a putut parsa, afișăm textul ca info
        setScheduleFallback(parsedSchedule ? '' : (record.schedule || ''));
        setModalOpen(true);
    };

    const handleBeforeUpload = async (file: RcFile): Promise<boolean> => {
        if (!file.type.startsWith('image/')) {
            messageApi.error('Fișierul trebuie să fie o imagine.');
            return false;
        }
        const sizeMb = file.size / 1024 / 1024;
        if (sizeMb > MAX_IMAGE_MB) {
            messageApi.error(`Imaginea depășește ${MAX_IMAGE_MB}MB (actual: ${sizeMb.toFixed(1)}MB).`);
            return false;
        }
        try {
            const dataUrl = await fileToDataUrl(file);
            setImageSrc(dataUrl);
            messageApi.success('Imagine încărcată.');
        } catch (err) {
            messageApi.error(err instanceof Error ? err.message : 'Eroare la citire.');
        }
        return false;
    };

    const handleSave = async () => {
        type FormValues = Omit<ClubCreatePayload, 'imageUrl' | 'schedule'> & {
            schedule?: Dayjs | null;
            rating?: number;
        };
        let values: FormValues;
        try {
            values = await form.validateFields();
        } catch {
            return;
        }

        // Serializează DatePicker → string (cu numele zilei) pentru DB
        const scheduleStr = values.schedule
            ? dayjs(values.schedule).locale('ro').format(SCHEDULE_STORAGE_FORMAT)
            : (scheduleFallback || '');

        setSaving(true);
        try {
            if (editTarget) {
                const payload: ClubUpdatePayload = {
                    name:        values.name,
                    category:    values.category,
                    location:    values.location,
                    description: values.description,
                    level:       values.level,
                    schedule:    scheduleStr,
                    imageUrl:    imageSrc,
                    rating:      values.rating ?? editTarget.rating,
                };
                const updated = await clubApi.update(editTarget.id, payload);
                setClubs(prev => prev.map(c => c.id === editTarget.id ? updated : c));
                messageApi.success('Clubul a fost actualizat.');
            } else {
                const payload: ClubCreatePayload = {
                    name:        values.name,
                    category:    values.category,
                    location:    values.location,
                    description: values.description,
                    level:       values.level,
                    schedule:    scheduleStr,
                    imageUrl:    imageSrc,
                };
                const created = await clubApi.create(payload);
                setClubs(prev => [created, ...prev]);
                messageApi.success('Clubul a fost adăugat.');
            }
            setModalOpen(false);
        } catch (err: unknown) {
            messageApi.error(err instanceof Error ? err.message : 'Eroare la salvare.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await clubApi.delete(id);
            setClubs(prev => prev.filter(c => c.id !== id));
            messageApi.success('Clubul a fost șters.');
        } catch (err: unknown) {
            messageApi.error(err instanceof Error ? err.message : 'Eroare la ștergere.');
        }
    };

    const columns: ColumnsType<ClubDto> = [
        {
            title: '',
            key: 'image',
            width: 60,
            render: (_, r) => (
                r.imageUrl
                    ? <AntImage src={r.imageUrl} width={44} height={44}
                                style={{ objectFit: 'cover', borderRadius: 6 }} preview={false}
                                fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0NCA0NCc+PHJlY3Qgd2lkdGg9JzQ0JyBoZWlnaHQ9JzQ0JyBmaWxsPScjZjBmMGYwJy8+PC9zdmc+" />
                    : <div style={{ width: 44, height: 44, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18 }}>🏟️</div>
            ),
        },
        {
            title: 'Club',
            key: 'name',
            render: (_, r) => (
                <div>
                    <Text strong style={{ display: 'block' }}>{r.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{r.location}</Text>
                </div>
            ),
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag color={CATEGORY_COLORS[cat] ?? 'default'}>{cat}</Tag>,
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => <Tag color={LEVEL_COLORS[level] ?? 'default'}>{level}</Tag>,
        },
        {
            title: 'Membri',
            dataIndex: 'membersCount',
            key: 'membersCount',
            sorter: (a, b) => a.membersCount - b.membersCount,
            render: (m: number) => <Text strong>{m?.toLocaleString() ?? 0}</Text>,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            render: (r: number) => (
                <Space>
                    <Rate disabled value={r} allowHalf style={{ fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>({r})</Text>
                </Space>
            ),
        },
        {
            title: 'Program',
            dataIndex: 'schedule',
            key: 'schedule',
            render: (s: string) => <Text type="secondary" style={{ fontSize: 12 }}>{s || '—'}</Text>,
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, r) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>Editează</Button>
                    <Popconfirm
                        title="Șterge clubul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(r.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>Șterge</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        // ConfigProvider cu locale=roRO pentru ca DatePicker-ul să afișeze
        // săptămânile/lunile în română („luni, marți...", „ianuarie, februarie...").
        <ConfigProvider locale={roRO}>
            <div>
                {ctxHolder}

                <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ margin: 0 }}>Gestionare Cluburi</Title>
                    <Text type="secondary">Date live din baza de date PostgreSQL</Text>
                </div>

                {apiError && (
                    <Alert
                        type="error"
                        message="Nu s-a putut conecta la backend"
                        description={`${apiError} — Verifică că serverul .NET rulează și că CORS este configurat.`}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" icon={<ReloadOutlined />} onClick={fetchClubs}>
                                Reîncearcă
                            </Button>
                        }
                        closable
                        onClose={() => setApiError(null)}
                    />
                )}

                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <Space wrap>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Caută club, locație sau descriere..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: 320 }}
                            allowClear
                        />
                        <Select value={filterCat} onChange={setFilterCat} style={{ width: 180 }}>
                            <Option value="all">Toate categoriile</Option>
                            {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                        <Text type="secondary">{filtered.length} cluburi</Text>
                        <Button icon={<ReloadOutlined />} onClick={fetchClubs} loading={loading}>
                            Reîncarcă
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                            Adaugă club
                        </Button>
                    </Space>
                </Card>

                <Card style={{ borderRadius: 12 }}>
                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={filtered}
                            rowKey="id"
                            pagination={{ pageSize: 8, showSizeChanger: true }}
                            size="middle"
                            locale={{ emptyText: apiError ? 'Backend indisponibil' : 'Niciun club găsit' }}
                        />
                    </Spin>
                </Card>

                <Modal
                    title={
                        <Space>
                            <TeamOutlined />
                            <span>{editTarget ? 'Editează club' : 'Adaugă club nou'}</span>
                        </Space>
                    }
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    onOk={handleSave}
                    okText={editTarget ? 'Salvează' : 'Adaugă'}
                    cancelText="Anulează"
                    confirmLoading={saving}
                    width={680}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                        <Form.Item name="name" label="Denumire club"
                                   rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                            <Input placeholder="Ex: Runners Chișinău" />
                        </Form.Item>

                        <Form.Item name="description" label="Descriere">
                            <TextArea rows={3} placeholder="Descrierea clubului..." />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="category" label="Categorie"
                                           rules={[{ required: true, message: 'Selectează categoria' }]}>
                                    <Select placeholder="Selectează...">
                                        {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="level" label="Nivel">
                                    <Select placeholder="Selectează...">
                                        {LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={14}>
                                <Form.Item name="location" label="Locație">
                                    <Input placeholder="Ex: Parcul Valea Morilor, Chișinău" />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                {/* ── Program: DatePicker cu calendar + numele zilei afișat în format ── */}
                                <Form.Item name="schedule" label="Program (dată + ora)">
                                    <DatePicker
                                        showTime={{ format: 'HH:mm', minuteStep: 5 }}
                                        format="dddd, D MMM YYYY, HH:mm"
                                        placeholder="Selectează data și ora"
                                        style={{ width: '100%' }}
                                        suffixIcon={<CalendarOutlined />}
                                        minuteStep={5}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {scheduleFallback && (
                            <Alert
                                type="info"
                                showIcon
                                message={<span>Program vechi (text liber): <Text code>{scheduleFallback}</Text></span>}
                                description="Selectează o dată în calendar pentru a-l înlocui cu un program structurat."
                                style={{ marginBottom: 16 }}
                                closable
                                onClose={() => setScheduleFallback('')}
                            />
                        )}

                        {editTarget && (
                            <Form.Item name="rating" label="Rating (0–5)">
                                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        )}

                        {/* ── Imagine: URL sau upload din PC ─────────────────────────── */}
                        <Form.Item label="Imagine club">
                            <Space.Compact style={{ marginBottom: 8 }}>
                                <Button
                                    type={imageMode === 'url' ? 'primary' : 'default'}
                                    icon={<LinkOutlined />}
                                    onClick={() => setImageMode('url')}
                                >
                                    URL
                                </Button>
                                <Button
                                    type={imageMode === 'upload' ? 'primary' : 'default'}
                                    icon={<UploadOutlined />}
                                    onClick={() => setImageMode('upload')}
                                >
                                    Din PC
                                </Button>
                            </Space.Compact>

                            {imageMode === 'url' ? (
                                <Input
                                    placeholder="https://..."
                                    value={imageSrc.startsWith('data:') ? '' : imageSrc}
                                    onChange={e => setImageSrc(e.target.value)}
                                    allowClear
                                />
                            ) : (
                                <Upload.Dragger
                                    accept="image/*"
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={handleBeforeUpload}
                                    style={{ padding: '8px 0' }}
                                >
                                    <p style={{ margin: 0, fontSize: 14 }}>
                                        <UploadOutlined style={{ marginRight: 8 }} />
                                        Trage un fișier aici sau click pentru selectare
                                    </p>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Max {MAX_IMAGE_MB}MB. Format JPG/PNG/WebP.
                                    </Text>
                                </Upload.Dragger>
                            )}

                            {imageSrc && (
                                <div style={{
                                    marginTop: 12, padding: 8, border: '1px solid #f0f0f0',
                                    borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12,
                                }}>
                                    <AntImage
                                        src={imageSrc}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'cover', borderRadius: 6 }}
                                        fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4MCA4MCc+PHJlY3Qgd2lkdGg9JzgwJyBoZWlnaHQ9JzgwJyBmaWxsPScjZjBmMGYwJy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGZvbnQtc2l6ZT0nMTInIGZpbGw9JyM5OTknIHRleHQtYW5jaG9yPSdtaWRkbGUnIGR5PScuM2VtJz5OL0E8L3RleHQ+PC9zdmc+"
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text strong style={{ display: 'block' }}>Previzualizare</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {imageSrc.startsWith('data:') ? 'Imagine încărcată local (base64)' : 'URL extern'}
                                        </Text>
                                    </div>
                                    <Button danger size="small" icon={<DeleteFilled />} onClick={() => setImageSrc('')}>
                                        Șterge
                                    </Button>
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default AdminClubs;
