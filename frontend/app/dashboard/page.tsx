'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, getAnnouncements } from '@/lib/api';

interface Category {
    id: number;
    name: string;
    icon: string;
    order: number;
    _count?: {
        subcategories: number;
    };
}

interface Announcement {
    id: number;
    title: string;
    content: string | null;
    youtubeUrl: string | null;
    imageUrl: string | null;
    buttonText: string | null;
    buttonUrl: string | null;
    isActive: boolean;
}

export default function DashboardPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [categoriesRes, announcementsRes] = await Promise.all([
                getCategories(),
                getAnnouncements(),
            ]);
            setCategories(categoriesRes.data.categories);
            setAnnouncements(announcementsRes.data.announcements);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Announcements Section */}
            {announcements.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ marginBottom: '16px' }}>📢 Novidades</h2>
                    <div className="grid grid-2">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="card">
                                <h3 className="card-title">{announcement.title}</h3>

                                {announcement.content && (
                                    <p style={{ marginTop: '12px', whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
                                )}

                                {announcement.youtubeUrl && getYoutubeEmbedUrl(announcement.youtubeUrl) && (
                                    <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <iframe
                                            width="100%"
                                            height="250"
                                            src={getYoutubeEmbedUrl(announcement.youtubeUrl)!}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {announcement.imageUrl && (
                                    <img
                                        src={announcement.imageUrl}
                                        alt={announcement.title}
                                        style={{ width: '100%', borderRadius: '12px', marginTop: '16px' }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}

                                {announcement.buttonText && announcement.buttonUrl && (
                                    <a
                                        href={announcement.buttonUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ marginTop: '16px', display: 'inline-block', width: '100%', textAlign: 'center' }}
                                    >
                                        {announcement.buttonText}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Section */}
            <div>
                <h2 style={{ marginBottom: '16px' }}>📁 Categorias</h2>
                <div className="grid grid-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/dashboard/category/${category.id}`}
                            className="card"
                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>
                                {category.icon || '📁'}
                            </div>
                            <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '8px' }}>
                                {category.name}
                            </h3>
                            {category._count && (
                                <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                                    {category._count.subcategories} subcategoria{category._count.subcategories !== 1 ? 's' : ''}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
