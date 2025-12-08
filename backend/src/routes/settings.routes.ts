import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get settings (public - no auth required for basic branding)
router.get('/', async (req, res: Response) => {
    try {
        let settings = await prisma.settings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    appName: 'Raiar Mensagens',
                    primaryColor: '#5B2DFF',
                    secondaryColor: '#8B78FF',
                    faviconUrl: null,
                    pageTitle: 'Raiar Mensagens',
                    seoTitle: 'Raiar Mensagens - Sistema de Mensagens',
                    theme: 'light',
                    loginBgType: 'gradient',
                },
            });
        }

        return res.json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

// Update settings (admin only)
router.put('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { appName, primaryColor, secondaryColor, logoUrl, faviconUrl, pageTitle, seoTitle, theme, loginBgType, loginBgValue, loginBgGradient } = req.body;

        let settings = await prisma.settings.findFirst();

        if (!settings) {
            // Create if doesn't exist
            settings = await prisma.settings.create({
                data: {
                    appName: appName || 'Raiar Mensagens',
                    primaryColor: primaryColor || '#5B2DFF',
                    secondaryColor: secondaryColor || '#8B78FF',
                    logoUrl: logoUrl || null,
                    faviconUrl: faviconUrl || null,
                    pageTitle: pageTitle || 'Raiar Mensagens',
                    seoTitle: seoTitle || 'Raiar Mensagens - Sistema de Mensagens',
                    theme: theme || 'light',
                    loginBgType: loginBgType || 'gradient',
                    loginBgValue: loginBgValue || null,
                    loginBgGradient: loginBgGradient || null,
                },
            });
        } else {
            // Update existing
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    ...(appName !== undefined && { appName }),
                    ...(primaryColor !== undefined && { primaryColor }),
                    ...(secondaryColor !== undefined && { secondaryColor }),
                    ...(logoUrl !== undefined && { logoUrl }),
                    ...(faviconUrl !== undefined && { faviconUrl }),
                    ...(pageTitle !== undefined && { pageTitle }),
                    ...(seoTitle !== undefined && { seoTitle }),
                    ...(theme !== undefined && { theme }),
                    ...(loginBgType !== undefined && { loginBgType }),
                    ...(loginBgValue !== undefined && { loginBgValue }),
                    ...(loginBgGradient !== undefined && { loginBgGradient }),
                },
            });
        }

        return res.json({ settings });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
});

export default router;
