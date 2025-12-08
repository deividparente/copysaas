import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// Get messages (optionally filtered by subcategory)
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const { subcategoryId } = req.query;

        const messages = await prisma.message.findMany({
            where: subcategoryId ? { subcategoryId: parseInt(subcategoryId as string) } : undefined,
            include: {
                subcategory: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        return res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        return res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// Create message (admin only)
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { content, subcategoryId, order } = req.body;

        if (!content || !subcategoryId) {
            return res.status(400).json({ error: 'Conteúdo e subcategoria são obrigatórios' });
        }

        const message = await prisma.message.create({
            data: {
                content,
                subcategoryId: parseInt(subcategoryId),
                order: order || 0,
            },
            include: {
                subcategory: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return res.status(201).json({ message });
    } catch (error) {
        console.error('Create message error:', error);
        return res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
});

// Update message (admin only)
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { content, subcategoryId, order } = req.body;

        const message = await prisma.message.update({
            where: { id: parseInt(id) },
            data: {
                ...(content && { content }),
                ...(subcategoryId && { subcategoryId: parseInt(subcategoryId) }),
                ...(order !== undefined && { order }),
            },
            include: {
                subcategory: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return res.json({ message });
    } catch (error) {
        console.error('Update message error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
});

// Delete message (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.message.delete({
            where: { id: parseInt(id) },
        });

        return res.json({ message: 'Mensagem excluída com sucesso' });
    } catch (error) {
        console.error('Delete message error:', error);
        return res.status(500).json({ error: 'Erro ao excluir mensagem' });
    }
});

export default router;
