import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all users
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                firstLogin: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Create user
router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Default password: Raiar@2026
        const hashedPassword = await bcrypt.hash('Raiar@2026', 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                firstLogin: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                firstLogin: true,
                createdAt: true,
            },
        });

        return res.status(201).json({ user });
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Update user
router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        // Allow admin to change user password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
            updateData.firstLogin = false; // Reset first login when admin changes password
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                firstLogin: true,
                createdAt: true,
            },
        });

        return res.json({ user });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Delete user
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user!.id) {
            return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
        }

        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        return res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
});

export default router;
