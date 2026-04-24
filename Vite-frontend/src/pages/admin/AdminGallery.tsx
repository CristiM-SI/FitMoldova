import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Table,
    Button,
    Space,
    Tag,
    Popconfirm,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    message,
    Tooltip,
    Image,
    Typography,
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import galleryApi, {
    type GalleryInfoDto,
    GALLERY_CATEGORIES,
    resolveImageUrl,
} from '../../services/api/galleryApi';

const { Title, Text } = Typography;

const AdminGallery: React.FC = () => {
    const [items, setItems] = useState<GalleryInfoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryInfoDto | null>(null);
    const [uploadingFile, setUploadingFile] = useState<UploadFile | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [uploadForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Guard pentru StrictMode — dacă useEffect se apelează de două ori, ultimul apel câștigă
    const loadSeq = useRef(0);

    const loadItems = useCallback(async () => {
        const seq = ++loadSeq.current;
        setLoading(true);
        try {
            const data = await galleryApi.getAllAdmin();
            if (seq === loadSeq.current) setItems(data);
        } catch (err: any) {
            if (seq === loadSeq.current) {
                message.error(err.message || 'Nu am putut încărca galeria.');
                setItems([]);
            }
        } finally {
            if (seq === loadSeq.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // ───────────────── Upload ─────────────────
    const handleUpload = async () => {
        try {
            const values = await uploadForm.validateFields();
            if (!uploadingFile || !uploadingFile.originFileObj) {
                message.error('Selectează o imagine.');
                return;
            }
            setSubmitting(true);
            await galleryApi.upload({
                title: values.title,
                description: values.description || '',
                category: values.category,
                tags: values.tags || [],
                file: uploadingFile.originFileObj as File,
            });
            message.success('Imagine adăugată cu succes.');
            setUploadOpen(false);
            uploadForm.resetFields();
            setUploadingFile(null);
            loadItems();
        } catch (err: any) {
            if (err?.errorFields) return; // erori de validare — nu afișăm toast
            message.error(err.message || 'Eroare la upload.');
        } finally {
            setSubmitting(false);
        }
    };

    // Antd Upload — interceptează fișierul fără să-l trimită imediat.
    // Îl păstrăm în state și-l atașăm la submit-ul formularului.
    const uploadProps: UploadProps = {
        accept: '.jpg,.jpeg,.png,.webp',
        maxCount: 1,
        beforeUpload: (file) => {
            // Validări locale — doar UX, serverul refuză oricum cele invalide.
            const isValid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            if (!isValid) {
                message.error('Doar JPG, PNG sau WebP sunt permise.');
                return Upload.LIST_IGNORE;
            }
            if (file.size > 5 * 1024 * 1024) {
                message.error('Fișierul depășește 5 MB.');
                return Upload.LIST_IGNORE;
            }
            return false; // previne upload-ul automat
        },
        onChange: (info) => {
            const last = info.fileList[info.fileList.length - 1];
            setUploadingFile(last || null);
        },
        fileList: uploadingFile ? [uploadingFile] : [],
        onRemove: () => setUploadingFile(null),
    };

    // ───────────────── Edit ─────────────────
    const openEdit = (item: GalleryInfoDto) => {
        setEditingItem(item);
        editForm.setFieldsValue({
            title: item.title,
            description: item.description,
            category: item.category,
            tags: item.tags,
            isPublished: item.isPublished,
        });
    };

    const handleEditSubmit = async () => {
        if (!editingItem) return;
        try {
            const values = await editForm.validateFields();
            setSubmitting(true);
            await galleryApi.update(editingItem.id, {
                title: values.title,
                description: values.description || '',
                category: values.category,
                tags: values.tags || [],
                isPublished: values.isPublished ?? true,
            });
            message.success('Imagine actualizată.');
            setEditingItem(null);
            loadItems();
        } catch (err: any) {
            if (err?.errorFields) return;
            message.error(err.message || 'Eroare la actualizare.');
        } finally {
            setSubmitting(false);
        }
    };

    // ───────────────── Toggle & Delete ─────────────────
    const togglePublished = async (id: number) => {
        try {
            await galleryApi.togglePublished(id);
            loadItems();
        } catch (err: any) {
            message.error(err.message || 'Eroare la toggle.');
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await galleryApi.delete(id);
            message.success('Imagine ștearsă.');
            loadItems();
        } catch (err: any) {
            message.error(err.message || 'Eroare la ștergere.');
        }
    };

    // ───────────────── Columns ─────────────────
    const columns = [
        {
            title: 'Preview',
            dataIndex: 'thumbnailUrl',
            key: 'thumbnailUrl',
            width: 100,
            render: (url: string) => (
                <Image
                    src={resolveImageUrl(url)}
                    width={64}
                    height={64}
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                    preview={false}
                />
            ),
        },
        {
            title: 'Titlu',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, r: GalleryInfoDto) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    {r.description && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {r.description.slice(0, 60)}
                            {r.description.length > 60 ? '...' : ''}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            key: 'category',
            width: 130,
            render: (c: string) => <Tag color="blue">{c}</Tag>,
        },
        {
            title: 'Tag-uri',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                <Space size={[4, 4]} wrap>
                    {tags.slice(0, 3).map((t) => (
                        <Tag key={t} style={{ margin: 0 }}>
                            #{t}
                        </Tag>
                    ))}
                    {tags.length > 3 && <Tag style={{ margin: 0 }}>+{tags.length - 3}</Tag>}
                </Space>
            ),
        },
        {
            title: 'Dim.',
            dataIndex: 'fileSizeBytes',
            key: 'fileSizeBytes',
            width: 90,
            render: (bytes: number, r: GalleryInfoDto) => (
                <Tooltip title={`${r.width}×${r.height}px`}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {(bytes / 1024).toFixed(0)} KB
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isPublished',
            key: 'isPublished',
            width: 110,
            render: (published: boolean) =>
                published ? <Tag color="green">Publicat</Tag> : <Tag color="orange">Ascuns</Tag>,
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 110,
            render: (d: string) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(d).toLocaleDateString('ro-MD')}
                </Text>
            ),
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            width: 160,
            render: (_: unknown, r: GalleryInfoDto) => (
                <Space>
                    <Tooltip title={r.isPublished ? 'Ascunde' : 'Publică'}>
                        <Button
                            icon={r.isPublished ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            size="small"
                            onClick={() => togglePublished(r.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Editează">
                        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
                    </Tooltip>
                    <Popconfirm
                        title="Șterge definitiv?"
                        description="Fișierul va fi șters și de pe disk."
                        onConfirm={() => deleteItem(r.id)}
                        okText="Da"
                        cancelText="Nu"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // ───────────────── Render ─────────────────
    return (
        <div style={{ padding: 24 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Galerie
                    </Title>
                    <Text type="secondary">
                        {items.length} imagini total • {items.filter((i) => i.isPublished).length}{' '}
                        publicate
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setUploadOpen(true)}
                >
                    Adaugă imagine
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* ── Upload Modal ── */}
            <Modal
                title="Adaugă imagine în galerie"
                open={uploadOpen}
                onCancel={() => {
                    setUploadOpen(false);
                    uploadForm.resetFields();
                    setUploadingFile(null);
                }}
                onOk={handleUpload}
                okText="Adaugă"
                cancelText="Anulează"
                confirmLoading={submitting}
                width={600}
                destroyOnClose
            >
                <Form form={uploadForm} layout="vertical" initialValues={{ category: 'Altele' }}>
                    <Form.Item label="Fișier" required>
                        <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click sau trage o imagine aici
                            </p>
                            <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                                JPG, PNG sau WebP · max 5 MB
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Titlu"
                        rules={[
                            { required: true, message: 'Titlul este obligatoriu' },
                            { min: 3, message: 'Minim 3 caractere' },
                            { max: 100, message: 'Maxim 100 caractere' },
                        ]}
                    >
                        <Input placeholder="Ex. Maratonul Chișinău 2026" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Descriere"
                        rules={[{ max: 500, message: 'Maxim 500 caractere' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Descriere opțională..." />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Categorie"
                        rules={[{ required: true }]}
                    >
                        <Select options={GALLERY_CATEGORIES.map((c) => ({ label: c, value: c }))} />
                    </Form.Item>

                    <Form.Item name="tags" label="Tag-uri (opțional, max 10)">
                        <Select
                            mode="tags"
                            placeholder="Apasă Enter după fiecare tag"
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal
                title="Editează imaginea"
                open={!!editingItem}
                onCancel={() => setEditingItem(null)}
                onOk={handleEditSubmit}
                okText="Salvează"
                cancelText="Anulează"
                confirmLoading={submitting}
                width={600}
                destroyOnClose
            >
                {editingItem && (
                    <div style={{ marginBottom: 16, textAlign: 'center' }}>
                        <Image
                            src={resolveImageUrl(editingItem.thumbnailUrl)}
                            height={150}
                            style={{ borderRadius: 8 }}
                        />
                    </div>
                )}
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Titlu"
                        rules={[
                            { required: true },
                            { min: 3, max: 100 },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Descriere" rules={[{ max: 500 }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="category" label="Categorie" rules={[{ required: true }]}>
                        <Select options={GALLERY_CATEGORIES.map((c) => ({ label: c, value: c }))} />
                    </Form.Item>

                    <Form.Item name="tags" label="Tag-uri">
                        <Select mode="tags" tokenSeparators={[',']} />
                    </Form.Item>

                    <Form.Item name="isPublished" label="Status" valuePropName="value">
                        <Select
                            options={[
                                { label: 'Publicat (vizibil public)', value: true },
                                { label: 'Ascuns', value: false },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminGallery;
