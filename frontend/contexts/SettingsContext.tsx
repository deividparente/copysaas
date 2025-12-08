'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSettings } from '@/lib/api';

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

interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: null,
    loading: true,
    refreshSettings: async () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await getSettings();
            const data = response.data.settings;
            setSettings(data);

            // Apply theme colors to CSS variables
            if (data) {
                document.documentElement.style.setProperty('--purple-500', data.primaryColor);
                document.documentElement.style.setProperty('--purple-400', data.secondaryColor);
                document.documentElement.style.setProperty('--purple-300', data.secondaryColor);

                // Apply dark/light theme
                if (data.theme === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                    document.documentElement.classList.remove('light-theme');
                } else {
                    document.documentElement.classList.add('light-theme');
                    document.documentElement.classList.remove('dark-theme');
                }

                // Update page title
                if (data.pageTitle) {
                    document.title = data.pageTitle;
                }

                // Update favicon
                if (data.faviconUrl) {
                    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                    }
                    link.href = data.faviconUrl;
                }

                // Update meta description (SEO)
                let metaDescription = document.querySelector('meta[name="description"]');
                if (!metaDescription) {
                    metaDescription = document.createElement('meta');
                    metaDescription.setAttribute('name', 'description');
                    document.head.appendChild(metaDescription);
                }
                metaDescription.setAttribute('content', data.seoTitle);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Set defaults if fetch fails
            setSettings({
                id: 1,
                appName: 'Raiar Mensagens',
                primaryColor: '#5B2DFF',
                secondaryColor: '#8B78FF',
                logoUrl: null,
                faviconUrl: null,
                pageTitle: 'Raiar Mensagens',
                seoTitle: 'Raiar Mensagens - Sistema de Mensagens',
                theme: 'light',
                loginBgType: 'gradient',
                loginBgValue: null,
                loginBgGradient: null,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const refreshSettings = async () => {
        await fetchSettings();
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
