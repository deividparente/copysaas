import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// Get subcategories (optionally filtered by category)
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const { categoryId } = req.query;

        const subcategories = await prisma.subcategory.findMany({
            where: categoryId ? { categoryId: parseInt(categoryId as string) } : undefined,
            include: {
                category: true,
                messages: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });

        return res.json({ subcategories });
    } catch (error) {
        console.error('Get subcategories error:', error);
        return res.status(500).json({ error: 'Erro ao buscar subcategorias' });
    }
});

// Create subcategory (admin only)
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, categoryId, order } = req.body;

        if (!name || !categoryId) {
            return res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
        }

        const subcategory = await prisma.subcategory.create({
            data: {
                name,
                categoryId: parseInt(categoryId),
                order: order || 0,
            },
            include: {
                category: true,
            },
        });

        return res.status(201).json({ subcategory });
    } catch (error) {
        console.error('Create subcategory error:', error);
        return res.status(500).json({ error: 'Erro ao criar subcategoria' });
    }
});

// Update subcategory (admin only)
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, categoryId, order } = req.body;

        const subcategory = await prisma.subcategory.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(categoryId && { categoryId: parseInt(categoryId) }),
                ...(order !== undefined && { order }),
            },
            include: {
                category: true,
            },
        });

        return res.json({ subcategory });
    } catch (error) {
        console.error('Update subcategory error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar subcategoria' });
    }
});

// Delete subcategory (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.subcategory.delete({
            where: { id: parseInt(id) },
        });

        return res.json({ message: 'Subcategoria excluída com sucesso' });
    } catch (error) {
        console.error('Delete subcategory error:', error);
        return res.status(500).json({ error: 'Erro ao excluir subcategoria' });
    }
});

export default router;
