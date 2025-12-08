'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';

export default function LoginPage() {
    const router = useRouter();
    const { settings } = useSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(email, password);
            const { user } = response.data;

            if (user.firstLogin) {
                router.push('/change-password');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    const getLoginBackground = () => {
        if (!settings) return `linear-gradient(135deg, #5B2DFF 0%, #8B78FF 100%)`;

        if (settings.loginBgType === 'solid') {
            return settings.loginBgValue || settings.primaryColor;
        } else if (settings.loginBgType === 'gradient') {
            return settings.loginBgGradient || `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`;
        } else if (settings.loginBgType === 'image' && settings.loginBgValue) {
            return `url(${settings.loginBgValue})`;
        }
        return `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`;
    };

    const backgroundStyle = settings?.loginBgType === 'image' && settings?.loginBgValue
        ? { background: `${getLoginBackground()} center/cover no-repeat` }
        : { background: getLoginBackground() };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', ...backgroundStyle }}>
            <div className="card" style={{ maxWidth: '420px', width: '90%' }}>
                <div className="text-center mb-4">
                    {settings?.logoUrl ? (
                        <div style={{ marginBottom: '16px' }}>
                            <img
                                src={settings.logoUrl}
                                alt={settings.appName}
                                style={{ maxWidth: '200px', maxHeight: '60px', objectFit: 'contain', margin: '0 auto' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    ) : null}
                    <h1 style={{ color: settings?.primaryColor || 'var(--purple-500)', marginBottom: '8px' }}>
                        {settings?.appName || 'Raiar Mensagens'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Faça login para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="badge badge-error mb-2" style={{ width: '100%', justifyContent: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            backgroundColor: settings?.primaryColor || 'var(--purple-500)'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
