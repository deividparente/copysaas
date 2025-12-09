'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout, getCategories } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Category {
    id: number;
    name: string;
    order: number;
    icon?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { settings } = useSettings();
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, categoriesRes] = await Promise.all([
                    getCurrentUser(),
                    getCategories(),
                ]);
                setUser(userRes.data.user);
                setCategories(categoriesRes.data.categories);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-logo">
                    {settings?.logoUrl ? (
                        <img
                            src={settings.logoUrl}
                            alt={settings.appName}
                            style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain' }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.textContent = settings.appName + ' 💬';
                            }}
                        />
                    ) : (
                        <span>{settings?.appName || 'Raiar'} 💬</span>
                    )}
                </div>

                <nav>
                    <ul className="sidebar-nav">
                        {/* Dashboard Home */}
                        <li className="sidebar-nav-item">
                            <Link
                                href="/dashboard"
                                className={`sidebar-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Início
                            </Link>
                        </li>

                        {/* Categories Section */}
                        {categories.length > 0 && (
                            <>
                                <li className="sidebar-nav-item" style={{ marginTop: '24px' }}>
                                    <div style={{ padding: '0 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Categorias
                                    </div>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id} className="sidebar-nav-item">
                                        <Link
                                            href={`/dashboard/category/${category.id}`}
                                            className={`sidebar-nav-link ${pathname.includes(`/dashboard/category/${category.id}`) ? 'active' : ''}`}
                                            onClick={closeSidebar}
                                        >
                                            <span className="sidebar-nav-icon" style={{ fontSize: '20px' }}>
                                                {category.icon || '📁'}
                                            </span>
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}

                        {/* Admin Section */}
                        {user.role === 'ADMIN' && (
                            <>
                                <li className="sidebar-nav-item" style={{ marginTop: '24px' }}>
                                    <div style={{ padding: '0 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Administração
                                    </div>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/users"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/users') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Usuários
                                    </Link>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/categories"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/categories') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Categorias
                                    </Link>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/subcategories"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/subcategories') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Subcategorias
                                    </Link>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/messages"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/messages') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Mensagens
                                    </Link>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/branding"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/branding') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        Branding Kit
                                    </Link>
                                </li>
                                <li className="sidebar-nav-item">
                                    <Link
                                        href="/dashboard/admin/announcements"
                                        className={`sidebar-nav-link ${pathname.includes('/dashboard/admin/announcements') ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                        Novidades
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ padding: '12px 16px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                        <div className="badge badge-primary mt-1">{user.role}</div>
                    </div>
                    <button onClick={handleLogout} className="sidebar-nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">{children}</main>
        </div>
    );
}
