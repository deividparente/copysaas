'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/lib/api';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            await changePassword(newPassword);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #5B2DFF 0%, #8B78FF 100%)' }}>
            <div className="card" style={{ maxWidth: '420px', width: '90%' }}>
                <div className="text-center mb-4">
                    <h1 style={{ color: 'var(--purple-500)', marginBottom: '8px' }}>Alterar Senha</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Por segurança, você precisa alterar sua senha no primeiro acesso
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="newPassword">
                            Nova Senha
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            className="input"
                            placeholder="Mínimo 6 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="confirmPassword">
                            Confirmar Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="input"
                            placeholder="Digite a senha novamente"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="badge badge-error mb-2" style={{ width: '100%', justifyContent: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
