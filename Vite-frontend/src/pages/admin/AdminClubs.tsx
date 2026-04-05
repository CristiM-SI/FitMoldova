import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Card, Input, Space, Tag, Button, Modal, Form,
  Select, InputNumber, Typography, Popconfirm, message,
  Rate, Row, Col, Spin, Alert,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, TeamOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { clubApi, type ClubDto, type ClubCreatePayload, type ClubUpdatePayload } from '../../services/API/clubApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = ['Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'];
const LEVELS     = ['Începător', 'Intermediar', 'Avansat', 'Toate'];

const CATEGORY_COLORS: Record<string, string> = {
  Alergare: 'blue', Ciclism: 'green', Fitness: 'orange',
  Yoga: 'purple', Înot: 'cyan', Trail: 'lime',
};
const LEVEL_COLORS: Record<string, string> = {
  Începător: 'green', Intermediar: 'orange', Avansat: 'red', Toate: 'blue',
};

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
  
  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await clubApi.getAll();
      setClubs(data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Nu s-a putut conecta la server.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  // ── Filtrare locală ───────────────────────────────────────────────────────
  const filtered = clubs.filter(c => {
    const term = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term);
    const matchCat = filterCat === 'all' || c.category === filterCat;
    return matchSearch && matchCat;
  });

  // ── Deschide modal Adaugă ─────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ── Deschide modal Editează ───────────────────────────────────────────────
  const openEdit = (record: ClubDto) => {
    setEditTarget(record);
    form.setFieldsValue({
      name:        record.name,
      category:    record.category,
      location:    record.location,
      description: record.description,
      schedule:    record.schedule,
      level:       record.level,
      rating:      record.rating,
    });
    setModalOpen(true);
  };

  // ── Salvează (Create sau Update) ──────────────────────────────────────────
  const handleSave = async () => {
    let values: ClubCreatePayload & { rating?: number };
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    setSaving(true);
    try {
      if (editTarget) {
        const payload: ClubUpdatePayload = { ...values, rating: values.rating ?? editTarget.rating };
        const updated = await clubApi.update(editTarget.id, payload);
        setClubs(prev => prev.map(c => c.id === editTarget.id ? updated : c));
        messageApi.success('Clubul a fost actualizat.');
      } else {
        const created = await clubApi.create(values);
        setClubs(prev => [created, ...prev]);
        messageApi.success('Clubul a fost adăugat.');
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la salvare.';
      messageApi.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Șterge ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await clubApi.delete(id);
      setClubs(prev => prev.filter(c => c.id !== id));
      messageApi.success('Clubul a fost șters.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la ștergere.';
      messageApi.error(msg);
    }
  };

  // ── Coloane tabel ─────────────────────────────────────────────────────────
  const columns: ColumnsType<ClubDto> = [
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
      dataIndex: 'members',
      key: 'members',
      sorter: (a, b) => a.members - b.members,
      render: (m: number) => <Text strong>{m.toLocaleString()}</Text>,
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
      render: (s: string) => <Text type="secondary">{s}</Text>,
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
            title="Șterge clubul"
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {ctxHolder}

      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Gestionare Cluburi</Title>
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
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchClubs}>
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
            placeholder="Caută club, locație sau descriere..."
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
          <Text type="secondary">{filtered.length} cluburi</Text>
          <Button icon={<ReloadOutlined />} onClick={fetchClubs} loading={loading}>
            Reîncarcă
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Adaugă club
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
              emptyText: apiError ? 'Backend indisponibil' : 'Niciun club găsit',
            }}
          />
        </Spin>
      </Card>

      {/* Modal Adaugă / Editează */}
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
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Denumire club"
            rules={[{ required: true, message: 'Câmp obligatoriu' }]}
          >
            <Input placeholder="Ex: Runners Chișinău" />
          </Form.Item>

          <Form.Item name="description" label="Descriere">
            <TextArea rows={3} placeholder="Descrierea clubului..." />
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
              <Form.Item name="schedule" label="Program">
                <Input placeholder="Ex: Sâmbătă & Duminică, 08:00" />
              </Form.Item>
            </Col>
          </Row>

          {/* Rating apare doar la editare */}
          {editTarget && (
            <Form.Item name="rating" label="Rating (0–5)">
              <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminClubs;
