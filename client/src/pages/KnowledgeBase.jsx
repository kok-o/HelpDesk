import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const KnowledgeBase = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await api.get('/articles');
                setArticles(data);
            } catch(e) {} finally { setLoading(false); }
        };
        fetchArticles();
    }, []);

    const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.9rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Dashboard
                </Link>
            </div>
            <div className="card mb-4 text-center glass-panel" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)', backdropFilter: 'blur(12px)' }}>
                <BookOpen size={48} color="var(--brand-primary)" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px' }}>How can we help?</h1>
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Search for answers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '48px', paddingRight: '16px', height: '48px', fontSize: '1rem', borderRadius: '24px', boxShadow: 'var(--glass-shadow)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {loading ? <p>Loading articles...</p> : filtered.length === 0 ? <p className="text-center" style={{ gridColumn: '1 / -1', padding: '40px' }}>No articles found.</p> : filtered.map(article => (
                    <div key={article.id} className="card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>{article.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.content}</p>
                        {article.tags && <span className="badge badge-closed">{article.tags}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeBase;
