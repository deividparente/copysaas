'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';

interface Category {
    id: number;
    name: string;
    icon: string;
    order: number;
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: '📁', order: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            await fetchCategories();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar categoria');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria? Todas as subcategorias e mensagens serão excluídas.')) return;

        try {
            await deleteCategory(id);
            await fetchCategories();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao excluir categoria');
        }
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon, order: category.order });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', icon: '📁', order: categories.length });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', icon: '📁', order: 0 });
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
                    <h1>Gerenciar Categorias</h1>
                    <p>Adicione, edite ou remova categorias</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Nova Categoria
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ícone</th>
                            <th>Ordem</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td style={{ fontSize: '24px' }}>{category.icon}</td>
                                <td>
                                    <span className="badge badge-primary">{category.order}</span>
                                </td>
                                <td>{category.name}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => openModal(category)} className="btn btn-secondary" style={{ padding: '8px 16px', height: 'auto' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="btn btn-danger" style={{ padding: '8px 16px', height: 'auto' }}>
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Nome</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Ícone / Emoji</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="📁"
                                    required
                                    maxLength={10}
                                />
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                    {['📁', '📂', '📋', '📝', '💬', '📧', '📱', '💼', '🎯', '⚡', '🔥', '✨'].map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            style={{
                                                fontSize: '24px',
                                                padding: '8px',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '8px',
                                                background: formData.icon === emoji ? 'var(--purple-500)' : 'transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
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
                                    {editingCategory ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
