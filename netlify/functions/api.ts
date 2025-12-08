import { Handler } from '@netlify/functions';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from '../../backend/src/routes/auth.routes';
import usersRoutes from '../../backend/src/routes/users.routes';
import categoriesRoutes from '../../backend/src/routes/categories.routes';
import subcategoriesRoutes from '../../backend/src/routes/subcategories.routes';
import messagesRoutes from '../../backend/src/routes/messages.routes';
import settingsRoutes from '../../backend/src/routes/settings.routes';
import announcementsRoutes from '../../backend/src/routes/announcements.routes';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/subcategories', subcategoriesRoutes);
app.use('/messages', messagesRoutes);
app.use('/settings', settingsRoutes);
app.use('/announcements', announcementsRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export handler
export const handler: Handler = serverless(app);
