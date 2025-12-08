import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// Get all categories (with subcategories)
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });

        return res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
});

// Create category (admin only)
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, order } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                order: order || 0,
            },
        });

        return res.status(201).json({ category });
    } catch (error) {
        console.error('Create category error:', error);
        return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
});

// Update category
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, icon, order } = req.body;

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(icon && { icon }),
                ...(order !== undefined && { order }),
            },
        });

        return res.json({ category });
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
});

// Delete category (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        return res.json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json({ error: 'Erro ao excluir categoria' });
    }
});

export default router;
