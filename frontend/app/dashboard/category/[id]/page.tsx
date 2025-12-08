'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubcategories } from '@/lib/api';

interface Message {
    id: number;
    content: string;
    order: number;
}

interface Subcategory {
    id: number;
    name: string;
    order: number;
    messages: Message[];
    category: {
        id: number;
        name: string;
    };
}

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = parseInt(params.id as string);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await getSubcategories(categoryId);
                setSubcategories(response.data.subcategories);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    const copyToClipboard = async (text: string, messageId: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(messageId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    const categoryName = subcategories[0]?.category.name || 'Categoria';

    return (
        <div>
            <div className="header">
                <div>
                    <button onClick={() => router.back()} className="btn btn-secondary mb-2">
                        ← Voltar
                    </button>
                    <h1>{categoryName}</h1>
                    <p>Clique em "Copiar" para copiar a mensagem para a área de transferência</p>
                </div>
            </div>

            {subcategories.length === 0 ? (
                <div className="card text-center">
                    <p>Nenhuma subcategoria cadastrada nesta categoria.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {subcategories.map((subcategory) => (
                        <div key={subcategory.id}>
                            <h2 style={{ marginBottom: '16px', color: 'var(--purple-500)' }}>{subcategory.name}</h2>

                            {subcategory.messages.length === 0 ? (
                                <div className="card">
                                    <p style={{ color: 'var(--text-muted)' }}>Nenhuma mensagem cadastrada nesta subcategoria.</p>
                                </div>
                            ) : (
                                <div className="grid grid-2">
                                    {subcategory.messages.map((message) => (
                                        <div key={message.id} className="card">
                                            <div className="card-body" style={{ marginBottom: '16px' }}>
                                                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{message.content}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(message.content, message.id)}
                                                className={`btn ${copiedId === message.id ? 'btn-success' : 'btn-primary'}`}
                                                style={{ width: '100%' }}
                                            >
                                                {copiedId === message.id ? '✅ Texto copiado!' : '📋 Copiar'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
