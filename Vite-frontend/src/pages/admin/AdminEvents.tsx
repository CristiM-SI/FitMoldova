// src/pages/admin/AdminEvents.tsx
// CRUD complet pentru Events — conectat la backend .NET prin eventApi

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Card, Input, Space, Tag, Button, Modal, Form,
  Select, InputNumber, Typography, Popconfirm, message,
  Badge, Row, Col, Spin, Alert,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, CalendarOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { eventApi, type EventDto, type EventCreatePayload } from '../../services/API/eventApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = ['Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'];
const DIFFICULTIES = ['Ușor', 'Mediu', 'Avansat', 'Toate'];

const CATEGORY_COLORS: Record<string, string> = {
  Maraton: 'red', Ciclism: 'blue', Yoga: 'purple', Fitness: 'orange',
  Trail: 'green', Înot: 'cyan', Social: 'magenta',
};
const DIFFICULTY_COLORS: Record<string, string> = {
  'Ușor': 'green', 'Mediu': 'orange', 'Avansat': 'red', 'Toate': 'blue',
};

const AdminEvents: React.FC = () => {
  const [events, setEvents]         = useState<EventDto[]>([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState<string>('all');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<EventDto | null>(null);
  const [form]                      = Form.useForm();
  const [messageApi, ctxHolder]     = message.useMessage();

  // ── Fetch toate evenimentele din BD ──────────────────────────────────────────
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const data = await eventApi.getAll();
            setEvents(data ?? []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Nu s-a putut conecta la server.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // ── Filtrare locală (fara request suplimentar) ───────────────────────────────
  const filtered = events.filter(ev => {
    const term = search.toLowerCase();
    const matchSearch =
      ev.name.toLowerCase().includes(term) ||
      ev.city.toLowerCase().includes(term) ||
      ev.organizer.toLowerCase().includes(term);
    const matchCat = filterCat === 'all' || ev.category === filterCat;
    return matchSearch && matchCat;
  });

  // ── Deschide modal Adaugă ────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ── Deschide modal Editează ──────────────────────────────────────────────────
  const openEdit = (record: EventDto) => {
    setEditTarget(record);
    form.setFieldsValue({
      name:            record.name,
      description:     record.description,
      // datetime-local asteapta "YYYY-MM-DDTHH:MM" — taiem milisecundele
      date:            record.date.substring(0, 16),
      location:        record.location,
      city:            record.city,
      category:        record.category,
      maxParticipants: record.maxParticipants,
      price:           record.price,
      organizer:       record.organizer,
      difficulty:      record.difficulty,
    });
    setModalOpen(true);
  };

  // ── Salvează (Create sau Update) ─────────────────────────────────────────────
  const handleSave = async () => {
    let values: EventCreatePayload;
    try {
      values = await form.validateFields();
    } catch {
      return; // validare esuata — Ant Design afiseaza erorile
    }

    setSaving(true);
    try {
        if (editTarget) {
            const updated = await eventApi.update(editTarget.id, values);
            setEvents(prev => prev.map(ev => ev.id === editTarget.id ? updated : ev));
            messageApi.success('Evenimentul a fost actualizat.');
        } else {
            const created = await eventApi.create(values);
            setEvents(prev => [created, ...prev]);
            messageApi.success('Evenimentul a fost adăugat.');
        }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la salvare.';
      messageApi.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Șterge ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await eventApi.delete(id);
      setEvents(prev => prev.filter(ev => ev.id !== id));
      messageApi.success('Evenimentul a fost șters.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la ștergere.';
      messageApi.error(msg);
    }
  };

  // ── Coloane tabel ────────────────────────────────────────────────────────────
  const columns: ColumnsType<EventDto> = [
    {
      title: 'Eveniment',
      key: 'name',
      render: (_, r) => (
        <div>
          <Text strong style={{ display: 'block' }}>{r.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.organizer}</Text>
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
      title: 'Dată',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => new Date(d).toLocaleDateString('ro-RO'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Localitate',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Participanți',
      key: 'participants',
      render: (_, r) => {
        const pct = r.maxParticipants > 0
          ? Math.round((r.participants / r.maxParticipants) * 100)
          : 0;
        const color = pct >= 90 ? 'red' : pct >= 60 ? 'orange' : 'green';
        return (
          <Badge
            count={`${r.participants}/${r.maxParticipants}`}
            style={{ backgroundColor: color, fontSize: 11 }}
          />
        );
      },
    },
    {
      title: 'Preț',
      dataIndex: 'price',
      key: 'price',
      render: (p: string) => <Tag color={p === 'Gratuit' ? 'green' : 'gold'}>{p}</Tag>,
    },
    {
      title: 'Dificultate',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (d: string) => <Tag color={DIFFICULTY_COLORS[d] ?? 'default'}>{d}</Tag>,
    },
    {
      title: 'Acțiuni',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>
            Editează
          </Button>
          <Popconfirm
            title="Șterge evenimentul"
            description="Această acțiune este ireversibilă."
            onConfirm={() => handleDelete(r.id)}
            okText="Șterge"
            cancelText="Anulează"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Șterge
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {ctxHolder}

      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Gestionare Evenimente</Title>
        <Text type="secondary">Date live din baza de date SQL Server</Text>
      </div>

      {/* Eroare conectare */}
      {apiError && (
        <Alert
          type="error"
          message="Nu s-a putut conecta la backend"
          description={`${apiError} — Verifică că serverul .NET rulează și că CORS este configurat.`}
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchEvents}>
              Reîncearcă
            </Button>
          }
          closable
          onClose={() => setApiError(null)}
        />
      )}

      {/* Filtre */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Caută eveniment, oraș sau organizator..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />
          <Select
            value={filterCat}
            onChange={setFilterCat}
            style={{ width: 180 }}
          >
            <Option value="all">Toate categoriile</Option>
            {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Text type="secondary">{filtered.length} evenimente</Text>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchEvents}
            loading={loading}
          >
            Reîncarcă
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
          >
            Adaugă eveniment
          </Button>
        </Space>
      </Card>

      {/* Tabel */}
      <Card style={{ borderRadius: 12 }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            size="middle"
            locale={{
              emptyText: apiError
                ? 'Backend indisponibil'
                : 'Niciun eveniment găsit',
            }}
          />
        </Spin>
      </Card>

      {/* Modal Adaugă / Editează */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>{editTarget ? 'Editează eveniment' : 'Adaugă eveniment nou'}</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editTarget ? 'Salvează' : 'Adaugă'}
        cancelText="Anulează"
        confirmLoading={saving}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Denumire eveniment"
            rules={[{ required: true, message: 'Câmp obligatoriu' }]}
          >
            <Input placeholder="Ex: Maratonul Chișinău 2027" />
          </Form.Item>

          <Form.Item name="description" label="Descriere">
            <TextArea rows={3} placeholder="Descrierea evenimentului..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Dată și oră"
                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
              >
                {/* input nativ HTML — compatibil cu orice proiect fara DatePicker */}
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Oraș"
                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
              >
                <Input placeholder="Chișinău" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="location" label="Locație exactă">
            <Input placeholder="Ex: Piața Marii Adunări Naționale" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Categorie"
                rules={[{ required: true, message: 'Selectează categoria' }]}
              >
                <Select placeholder="Selectează...">
                  {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label="Dificultate">
                <Select placeholder="Selectează...">
                  {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="maxParticipants"
                label="Capacitate maximă"
                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Preț">
                <Input placeholder="Gratuit sau 150 MDL" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="organizer" label="Organizator">
                <Input placeholder="FitMoldova" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminEvents;
