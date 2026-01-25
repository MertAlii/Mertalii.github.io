import { useState, useEffect } from 'react';
import { Folder, Star } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
    created_at: string;
}

export default function Projects({ theme = 'light' }: { theme?: string }) {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.github.com/users/MertAlii/repos?sort=created&direction=desc&per_page=100')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRepos(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch repos', err);
                setLoading(false);
            });
    }, []);

    const visibleRepos = repos.slice(0, visibleCount);

    return (
        <section className="container" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Projelerim <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>({repos.length})</span>
            </h2>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {visibleRepos.map(repo => (
                            <a
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '1.5rem',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.2s',
                                    height: '100%',
                                    textDecoration: 'none'
                                }}
                                className="project-card"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <Folder size={20} color="var(--accent-color)" />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {repo.stargazers_count > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Star size={12} /> {repo.stargazers_count}</span>}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{repo.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1rem', lineHeight: 1.5 }}>
                                    {repo.description || 'Açıklama yok.'}
                                </p>

                                {repo.language && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', opacity: 0.5 }}></span>
                                        {repo.language}
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>

                    {visibleCount < repos.length && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                style={{
                                    padding: '0.75rem 2rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    backgroundColor: 'transparent',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                Daha fazla getir
                            </button>
                        </div>
                    )}
                </>
            )}
            <div style={{ marginTop: '4rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>GitHub Katkıları</h3>
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden' // Hide scrollbar
                }}>
                    <div style={{ width: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="no-scrollbar">
                        <GitHubCalendar
                            username="MertAlii"
                            colorScheme={theme === 'dark' ? 'dark' : 'light'}
                            fontSize={12} // Slightly smaller font
                            blockSize={10} // Slightly smaller blocks to fit more
                            blockMargin={4}
                            style={{
                                color: 'var(--text-primary)',
                                margin: '0 auto',
                                display: 'block',
                                maxWidth: '100%'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
