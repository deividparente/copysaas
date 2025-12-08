'use client';

import { useEffect, useState } from 'react';
import { getMessages, getSubcategories, createMessage, updateMessage, deleteMessage } from '@/lib/api';

interface Subcategory {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
}

interface Message {
    id: number;
    content: string;
    order: number;
    subcategoryId: number;
    subcategory: Subcategory;
}

export default function MessagesAdminPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [formData, setFormData] = useState({ content: '', subcategoryId: 0, order: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [messagesRes, subcatsRes] = await Promise.all([getMessages(), getSubcategories()]);
            setMessages(messagesRes.data.messages);
            setSubcategories(subcatsRes.data.subcategories);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingMessage) {
                await updateMessage(editingMessage.id, formData);
            } else {
                await createMessage(formData);
            }
            await fetchData();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar mensagem');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

        try {
            await deleteMessage(id);
            await fetchData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao excluir mensagem');
        }
    };

    const openModal = (message?: Message) => {
        if (message) {
            setEditingMessage(message);
            setFormData({ content: message.content, subcategoryId: message.subcategoryId, order: message.order });
        } else {
            setEditingMessage(null);
            setFormData({ content: '', subcategoryId: subcategories[0]?.id || 0, order: messages.length });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMessage(null);
        setFormData({ content: '', subcategoryId: 0, order: 0 });
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
                    <h1>Gerenciar Mensagens</h1>
                    <p>Adicione, edite ou remova mensagens</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary" disabled={subcategories.length === 0}>
                    + Nova Mensagem
                </button>
            </div>

            {subcategories.length === 0 ? (
                <div className="card text-center">
                    <p>Você precisa criar subcategorias antes de adicionar mensagens.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ordem</th>
                                <th>Conteúdo</th>
                                <th>Subcategoria</th>
                                <th>Categoria</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td>
                                        <span className="badge badge-primary">{message.order}</span>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {message.content}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">{message.subcategory.name}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-warning">{message.subcategory.category.name}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openModal(message)} className="btn btn-secondary" style={{ padding: '8px 16px', height: 'auto' }}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(message.id)} className="btn btn-danger" style={{ padding: '8px 16px', height: 'auto' }}>
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingMessage ? 'Editar Mensagem' : 'Nova Mensagem'}</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Conteúdo</label>
                                <textarea
                                    className="input"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={5}
                                    required
                                    placeholder="Digite o texto da mensagem..."
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Subcategoria</label>
                                <select
                                    className="input"
                                    value={formData.subcategoryId}
                                    onChange={(e) => setFormData({ ...formData, subcategoryId: parseInt(e.target.value) })}
                                    required
                                >
                                    {subcategories.map((subcat) => (
                                        <option key={subcat.id} value={subcat.id}>
                                            {subcat.category.name} → {subcat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Ordem</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    required
                                />
                                <small>Menor número aparece primeiro</small>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingMessage ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
