'use client';

import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, changePassword } from '@/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    firstLogin: boolean;
    createdAt: string;
}

export default function UsersAdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'USER' });
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            await fetchUsers();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar usuário');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            // Call admin endpoint to change user password
            await updateUser(selectedUserId!, { password: newPassword } as any);
            alert('Senha alterada com sucesso!');
            closePasswordModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao alterar senha');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            await deleteUser(id);
            await fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao excluir usuário');
        }
    };

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email, role: user.role });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'USER' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'USER' });
    };

    const openPasswordModal = (userId: number) => {
        setSelectedUserId(userId);
        setNewPassword('');
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setSelectedUserId(null);
        setNewPassword('');
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
                    <h1>Gerenciar Usuários</h1>
                    <p>Adicione, edite ou remova usuários do sistema</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Novo Usuário
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Função</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.firstLogin ? (
                                        <span className="badge badge-warning">Primeiro acesso</span>
                                    ) : (
                                        <span className="badge badge-success">Ativo</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button onClick={() => openModal(user)} className="btn btn-secondary" style={{ padding: '8px 16px', height: 'auto' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => openPasswordModal(user.id)} className="btn btn-primary" style={{ padding: '8px 16px', height: 'auto' }}>
                                            🔑 Senha
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="btn btn-danger" style={{ padding: '8px 16px', height: 'auto' }}>
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
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
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Função</label>
                                <select
                                    className="input"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="USER">Usuário</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>

                            {!editingUser && (
                                <div className="badge badge-warning mb-2" style={{ width: '100%' }}>
                                    Senha padrão: Raiar@2026
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={closePasswordModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Alterar Senha do Usuário</h2>
                        </div>

                        <form onSubmit={handlePasswordChange}>
                            <div className="input-group">
                                <label className="input-label">Nova Senha</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    autoFocus
                                />
                                <small>Digite a nova senha para o usuário</small>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closePasswordModal} className="btn btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Alterar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
