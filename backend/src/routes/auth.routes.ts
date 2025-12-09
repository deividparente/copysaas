import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Login
router.post('/login', async (req, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                firstLogin: user.firstLogin,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                firstLogin: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Change password
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                password: hashedPassword,
                firstLogin: false,
            },
        });

        return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});

// Logout
router.post('/logout', (req, res: Response) => {
    res.clearCookie('token');
    return res.json({ message: 'Logout realizado com sucesso' });
});

export default router;
