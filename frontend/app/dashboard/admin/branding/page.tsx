'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';

interface Settings {
    id: number;
    appName: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    pageTitle: string;
    seoTitle: string;
    theme: string;
    loginBgType: string;
    loginBgValue: string | null;
    loginBgGradient: string | null;
}

export default function BrandingKitPage() {
    const { refreshSettings } = useSettings();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        appName: '',
        primaryColor: '',
        secondaryColor: '',
        logoUrl: '',
        faviconUrl: '',
        pageTitle: '',
        seoTitle: '',
        theme: 'light',
        loginBgType: 'gradient',
        loginBgValue: '',
        loginBgGradient: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await getSettings();
            const data = response.data.settings;
            setSettings(data);
            setFormData({
                appName: data.appName,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                logoUrl: data.logoUrl || '',
                faviconUrl: data.faviconUrl || '',
                pageTitle: data.pageTitle || 'Raiar Mensagens',
                seoTitle: data.seoTitle || 'Raiar Mensagens - Sistema de Mensagens',
                theme: data.theme || 'light',
                loginBgType: data.loginBgType || 'gradient',
                loginBgValue: data.loginBgValue || '',
                loginBgGradient: data.loginBgGradient || '',
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateSettings(formData);
            await refreshSettings();
            alert('✅ Configurações salvas com sucesso!');
            await fetchSettings();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefault = async () => {
        if (!confirm('Tem certeza que deseja restaurar as configurações padrão?')) return;

        const defaultSettings = {
            appName: 'Raiar Mensagens',
            primaryColor: '#5B2DFF',
            secondaryColor: '#8B78FF',
            logoUrl: '',
            faviconUrl: '',
            pageTitle: 'Raiar Mensagens',
            seoTitle: 'Raiar Mensagens - Sistema de Mensagens',
            theme: 'light',
            loginBgType: 'gradient',
            loginBgValue: '',
            loginBgGradient: '',
        };

        setFormData(defaultSettings);
    };

    const getLoginBackground = () => {
        if (formData.loginBgType === 'solid') {
            return formData.loginBgValue || '#5B2DFF';
        } else if (formData.loginBgType === 'gradient') {
            return formData.loginBgGradient || `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`;
        } else if (formData.loginBgType === 'image') {
            return `url(${formData.loginBgValue})`;
        }
        return `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`;
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
                    <h1>🎨 Branding Kit</h1>
                    <p>Personalize a identidade visual do sistema</p>
                </div>
                <button onClick={resetToDefault} className="btn btn-secondary">
                    Restaurar Padrão
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    {/* Configurações Gerais */}
                    <div className="card">
                        <h3 className="card-title mb-3">⚙️ Configurações Gerais</h3>

                        <div className="input-group">
                            <label className="input-label">Nome da Ferramenta</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.appName}
                                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                                placeholder="Ex: Minha Empresa"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">URL do Logo (opcional)</label>
                            <input
                                type="url"
                                className="input"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://exemplo.com/logo.png"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">URL do Favicon (opcional)</label>
                            <input
                                type="url"
                                className="input"
                                value={formData.faviconUrl}
                                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                                placeholder="https://exemplo.com/favicon.ico"
                            />
                            <small>Ícone que aparece na aba do navegador (16x16 ou 32x32 px)</small>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Título da Aba</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.pageTitle}
                                onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                                placeholder="Minha Empresa"
                                required
                            />
                            <small>Texto que aparece na aba do navegador</small>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Título SEO</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.seoTitle}
                                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                placeholder="Minha Empresa - Descrição do Sistema"
                                required
                            />
                            <small>Usado em buscadores e compartilhamentos (meta description)</small>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Tema do Sistema</label>
                            <select
                                className="input"
                                value={formData.theme}
                                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            >
                                <option value="light">☀️ Claro</option>
                                <option value="dark">🌙 Escuro</option>
                            </select>
                            <small>Define o tema para todos os usuários</small>
                        </div>
                    </div>

                    {/* Cores */}
                    <div className="card">
                        <h3 className="card-title mb-3">🎨 Paleta de Cores</h3>

                        <div className="input-group">
                            <label className="input-label">Cor Primária</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    style={{ width: '60px', height: '44px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    placeholder="#5B2DFF"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Cor Secundária</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    style={{ width: '60px', height: '44px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    placeholder="#8B78FF"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Login Background */}
                    <div className="card">
                        <h3 className="card-title mb-3">🖼️ Fundo da Tela de Login</h3>

                        <div className="input-group">
                            <label className="input-label">Tipo de Fundo</label>
                            <select
                                className="input"
                                value={formData.loginBgType}
                                onChange={(e) => setFormData({ ...formData, loginBgType: e.target.value })}
                            >
                                <option value="gradient">Gradiente</option>
                                <option value="solid">Cor Sólida</option>
                                <option value="image">Imagem</option>
                            </select>
                        </div>

                        {formData.loginBgType === 'solid' && (
                            <div className="input-group">
                                <label className="input-label">Cor do Fundo</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={formData.loginBgValue || '#5B2DFF'}
                                        onChange={(e) => setFormData({ ...formData, loginBgValue: e.target.value })}
                                        style={{ width: '60px', height: '44px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.loginBgValue || ''}
                                        onChange={(e) => setFormData({ ...formData, loginBgValue: e.target.value })}
                                        placeholder="#5B2DFF"
                                    />
                                </div>
                            </div>
                        )}

                        {formData.loginBgType === 'gradient' && (
                            <div className="input-group">
                                <label className="input-label">CSS Gradiente</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.loginBgGradient || ''}
                                    onChange={(e) => setFormData({ ...formData, loginBgGradient: e.target.value })}
                                    placeholder="linear-gradient(135deg, #5B2DFF 0%, #8B78FF 100%)"
                                />
                                <small>Deixe vazio para usar as cores primária e secundária</small>
                            </div>
                        )}

                        {formData.loginBgType === 'image' && (
                            <div className="input-group">
                                <label className="input-label">URL da Imagem</label>
                                <input
                                    type="url"
                                    className="input"
                                    value={formData.loginBgValue || ''}
                                    onChange={(e) => setFormData({ ...formData, loginBgValue: e.target.value })}
                                    placeholder="https://exemplo.com/background.jpg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="card">
                        <h3 className="card-title mb-3">👁️ Pré-visualização</h3>

                        {/* Login Preview */}
                        <div
                            style={{
                                padding: '32px',
                                background: formData.loginBgType === 'image' ? `${getLoginBackground()} center/cover` : getLoginBackground(),
                                borderRadius: '12px',
                                marginBottom: '16px',
                                minHeight: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', maxWidth: '300px', width: '100%' }}>
                                {formData.logoUrl && (
                                    <img
                                        src={formData.logoUrl}
                                        alt="Logo"
                                        style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain', marginBottom: '16px' }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <h3 style={{ color: formData.primaryColor, marginBottom: '8px', fontSize: '18px' }}>
                                    {formData.appName || 'Nome da Ferramenta'}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px' }}>Tela de Login</p>
                                <div
                                    style={{
                                        height: '36px',
                                        background: formData.primaryColor,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Entrar
                                </div>
                            </div>
                        </div>

                        {/* Theme Badge */}
                        <div className="badge badge-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            {formData.theme === 'dark' ? '🌙 Tema Escuro' : '☀️ Tema Claro'}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: '200px' }}>
                        {saving ? 'Salvando...' : '💾 Salvar Configurações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
