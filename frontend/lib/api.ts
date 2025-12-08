import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth
export const login = (email: string, password: string) =>
    api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = () => api.get('/auth/me');

export const changePassword = (newPassword: string) =>
    api.post('/auth/change-password', { newPassword });

// Users
export const getUsers = () => api.get('/users');

export const createUser = (data: { name: string; email: string; role?: string }) =>
    api.post('/users', data);

export const updateUser = (id: number, data: { name?: string; email?: string; role?: string; password?: string }) =>
    api.put(`/users/${id}`, data);

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

export const createCategory = (data: { name: string; order?: number }) =>
    api.post('/categories', data);

export const updateCategory = (id: number, data: { name?: string; order?: number }) =>
    api.put(`/categories/${id}`, data);

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

// Subcategories
export const getSubcategories = (categoryId?: number) =>
    api.get('/subcategories', { params: categoryId ? { categoryId } : {} });

export const createSubcategory = (data: { name: string; categoryId: number; order?: number }) =>
    api.post('/subcategories', data);

export const updateSubcategory = (id: number, data: { name?: string; categoryId?: number; order?: number }) =>
    api.put(`/subcategories/${id}`, data);

export const deleteSubcategory = (id: number) => api.delete(`/subcategories/${id}`);

// Messages
export const getMessages = (subcategoryId?: number) =>
    api.get('/messages', { params: subcategoryId ? { subcategoryId } : {} });

export const createMessage = (data: { content: string; subcategoryId: number; order?: number }) =>
    api.post('/messages', data);

export const updateMessage = (id: number, data: { content?: string; subcategoryId?: number; order?: number }) =>
    api.put(`/messages/${id}`, data);

export const deleteMessage = (id: number) => api.delete(`/messages/${id}`);

// Settings
export const getSettings = () => api.get('/settings');

export const updateSettings = (data: {
    appName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
    pageTitle?: string;
    seoTitle?: string;
    theme?: string;
    loginBgType?: string;
    loginBgValue?: string;
    loginBgGradient?: string;
}) => api.put('/settings', data);

// Announcements
export const getAnnouncements = () => api.get('/announcements');

export const getAllAnnouncements = () => api.get('/announcements/all');

export const createAnnouncement = (data: {
    title: string;
    content?: string;
    youtubeUrl?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    isActive?: boolean;
    order?: number;
}) => api.post('/announcements', data);

export const updateAnnouncement = (id: number, data: {
    title?: string;
    content?: string;
    youtubeUrl?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    isActive?: boolean;
    order?: number;
}) => api.put(`/announcements/${id}`, data);

export const deleteAnnouncement = (id: number) => api.delete(`/announcements/${id}`);

export default api;
