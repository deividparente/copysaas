import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all active announcements (public)
router.get('/', async (req, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });

        return res.json({ announcements });
    } catch (error) {
        console.error('Get announcements error:', error);
        return res.status(500).json({ error: 'Erro ao buscar novidades' });
    }
});

// Get all announcements (admin only)
router.get('/all', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { order: 'asc' },
        });

        return res.json({ announcements });
    } catch (error) {
        console.error('Get all announcements error:', error);
        return res.status(500).json({ error: 'Erro ao buscar novidades' });
    }
});

// Create announcement (admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, youtubeUrl, imageUrl, buttonText, buttonUrl, isActive, order } = req.body;

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content: content || null,
                youtubeUrl: youtubeUrl || null,
                imageUrl: imageUrl || null,
                buttonText: buttonText || null,
                buttonUrl: buttonUrl || null,
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0,
            },
        });

        return res.json({ announcement });
    } catch (error) {
        console.error('Create announcement error:', error);
        return res.status(500).json({ error: 'Erro ao criar novidade' });
    }
});

// Update announcement (admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, youtubeUrl, imageUrl, buttonText, buttonUrl, isActive, order } = req.body;

        const announcement = await prisma.announcement.update({
            where: { id: parseInt(id) },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(youtubeUrl !== undefined && { youtubeUrl }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(buttonText !== undefined && { buttonText }),
                ...(buttonUrl !== undefined && { buttonUrl }),
                ...(isActive !== undefined && { isActive }),
                ...(order !== undefined && { order }),
            },
        });

        return res.json({ announcement });
    } catch (error) {
        console.error('Update announcement error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar novidade' });
    }
});

// Delete announcement (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.announcement.delete({
            where: { id: parseInt(id) },
        });

        return res.json({ message: 'Novidade excluída com sucesso' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        return res.status(500).json({ error: 'Erro ao excluir novidade' });
    }
});

export default router;
