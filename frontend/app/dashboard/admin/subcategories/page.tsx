'use client';

import { useEffect, useState } from 'react';
import { getSubcategories, getCategories, createSubcategory, updateSubcategory, deleteSubcategory } from '@/lib/api';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    order: number;
    categoryId: number;
    category: Category;
}

export default function SubcategoriesAdminPage() {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [formData, setFormData] = useState({ name: '', categoryId: 0, order: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subcatsRes, catsRes] = await Promise.all([getSubcategories(), getCategories()]);
            setSubcategories(subcatsRes.data.subcategories);
            setCategories(catsRes.data.categories);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingSubcategory) {
                await updateSubcategory(editingSubcategory.id, formData);
            } else {
                await createSubcategory(formData);
            }
            await fetchData();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar subcategoria');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta subcategoria? Todas as mensagens serão excluídas.')) return;

        try {
            await deleteSubcategory(id);
            await fetchData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao excluir subcategoria');
        }
    };

    const openModal = (subcategory?: Subcategory) => {
        if (subcategory) {
            setEditingSubcategory(subcategory);
            setFormData({ name: subcategory.name, categoryId: subcategory.categoryId, order: subcategory.order });
        } else {
            setEditingSubcategory(null);
            setFormData({ name: '', categoryId: categories[0]?.id || 0, order: subcategories.length });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSubcategory(null);
        setFormData({ name: '', categoryId: 0, order: 0 });
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
                    <h1>Gerenciar Subcategorias</h1>
                    <p>Adicione, edite ou remova subcategorias</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary" disabled={categories.length === 0}>
                    + Nova Subcategoria
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="card text-center">
                    <p>Você precisa criar categorias antes de adicionar subcategorias.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ordem</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map((subcategory) => (
                                <tr key={subcategory.id}>
                                    <td>
                                        <span className="badge badge-primary">{subcategory.order}</span>
                                    </td>
                                    <td>{subcategory.name}</td>
                                    <td>
                                        <span className="badge badge-success">{subcategory.category.name}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openModal(subcategory)} className="btn btn-secondary" style={{ padding: '8px 16px', height: 'auto' }}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(subcategory.id)} className="btn btn-danger" style={{ padding: '8px 16px', height: 'auto' }}>
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
                            <h2 className="modal-title">{editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}</h2>
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
                                <label className="input-label">Categoria</label>
                                <select
                                    className="input"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
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
                                    {editingSubcategory ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
