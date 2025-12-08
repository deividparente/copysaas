'use client';

import { useEffect, useState } from 'react';
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/api';

interface Announcement {
    id: number;
    title: string;
    content: string | null;
    youtubeUrl: string | null;
    imageUrl: string | null;
    buttonText: string | null;
    buttonUrl: string | null;
    isActive: boolean;
    order: number;
}

export default function AnnouncementsAdminPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        youtubeUrl: '',
        imageUrl: '',
        buttonText: '',
        buttonUrl: '',
        isActive: true,
        order: 0,
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await getAllAnnouncements();
            setAnnouncements(response.data.announcements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingAnnouncement) {
                await updateAnnouncement(editingAnnouncement.id, formData);
            } else {
                await createAnnouncement(formData);
            }
            await fetchAnnouncements();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar novidade');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta novidade?')) return;

        try {
            await deleteAnnouncement(id);
            await fetchAnnouncements();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao excluir novidade');
        }
    };

    const openModal = (announcement?: Announcement) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({
                title: announcement.title,
                content: announcement.content || '',
                youtubeUrl: announcement.youtubeUrl || '',
                imageUrl: announcement.imageUrl || '',
                buttonText: announcement.buttonText || '',
                buttonUrl: announcement.buttonUrl || '',
                isActive: announcement.isActive,
                order: announcement.order,
            });
        } else {
            setEditingAnnouncement(null);
            setFormData({
                title: '',
                content: '',
                youtubeUrl: '',
                imageUrl: '',
                buttonText: '',
                buttonUrl: '',
                isActive: true,
                order: announcements.length,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAnnouncement(null);
    };

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <div>
                    <h1>📢 Gerenciar Novidades</h1>
                    <p>Crie avisos com texto, vídeos, imagens e botões</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Nova Novidade
                </button>
            </div>

            <div className="grid grid-2">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">{announcement.title}</h3>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <span className={`badge ${announcement.isActive ? 'badge-success' : 'badge-error'}`}>
                                        {announcement.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <span className="badge badge-primary">Ordem: {announcement.order}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openModal(announcement)} className="btn btn-secondary" style={{ padding: '8px 16px', height: 'auto' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(announcement.id)} className="btn btn-danger" style={{ padding: '8px 16px', height: 'auto' }}>
                                    Excluir
                                </button>
                            </div>
                        </div>

                        {announcement.content && <p style={{ marginTop: '12px' }}>{announcement.content}</p>}

                        {announcement.youtubeUrl && getYoutubeEmbedUrl(announcement.youtubeUrl) && (
                            <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden' }}>
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={getYoutubeEmbedUrl(announcement.youtubeUrl)!}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {announcement.imageUrl && (
                            <img
                                src={announcement.imageUrl}
                                alt={announcement.title}
                                style={{ width: '100%', borderRadius: '12px', marginTop: '12px' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}

                        {announcement.buttonText && announcement.buttonUrl && (
                            <a
                                href={announcement.buttonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ marginTop: '12px', display: 'inline-block' }}
                            >
                                {announcement.buttonText}
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingAnnouncement ? 'Editar Novidade' : 'Nova Novidade'}</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Título *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Conteúdo (opcional)</label>
                                <textarea
                                    className="input"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Texto da novidade..."
                                    rows={4}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">URL do YouTube (opcional)</label>
                                <input
                                    type="url"
                                    className="input"
                                    value={formData.youtubeUrl}
                                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                <small>Cole o link completo do vídeo do YouTube</small>
                            </div>

                            <div className="input-group">
                                <label className="input-label">URL da Imagem (opcional)</label>
                                <input
                                    type="url"
                                    className="input"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">Texto do Botão (opcional)</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                        placeholder="Saiba mais"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">URL do Botão (opcional)</label>
                                    <input
                                        type="url"
                                        className="input"
                                        value={formData.buttonUrl}
                                        onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">Status</label>
                                    <select
                                        className="input"
                                        value={formData.isActive ? 'true' : 'false'}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    >
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Ordem</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    />
                                    <small>Menor número aparece primeiro</small>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingAnnouncement ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
