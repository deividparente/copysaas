import type { Metadata } from 'next'
import './globals.css'
import { SettingsProvider } from '@/contexts/SettingsContext'

export const metadata: Metadata = {
    title: 'Raiar Mensagens - Sistema de Cópia de Mensagens',
    description: 'Sistema SaaS para gerenciamento e cópia de mensagens categorizadas',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </body>
        </html>
    )
}
