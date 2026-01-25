import { FileText, MapPin, Globe } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVDocument } from './PDF/CVDocument';
import { personalInfo } from '../data';

export default function Hero() {
    return (
        <section className="container" style={{ margin: '6rem auto 6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>

                    {/* Üst Başlık / Etiket */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        width: 'fit-content',
                        color: 'var(--accent-color)',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}>
                        <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }}></span>
                        Open to Work & Freelance
                    </div>

                    {/* Ana Başlık */}
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                            background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {personalInfo.name}
                        </h1>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {personalInfo.title}
                        </h2>
                    </div>

                    {/* Bilgi Kartları (Konum vs) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={18} />
                            <span>{personalInfo.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={18} />
                            <span>Bilişim Sistemleri Öğrencisi</span>
                        </div>
                    </div>

                    {/* Hakkımda Metni - Daha Profesyonel ve Akıcı */}
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '1rem', maxWidth: '700px' }}>
                        {personalInfo.about.map((paragraph, index) => (
                            <p key={index} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Butonlar */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href="#contact"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.8rem 2rem',
                                backgroundColor: 'var(--text-primary)',
                                color: 'var(--bg-primary)',
                                borderRadius: '8px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            İletişime Geç
                        </a>

                        <PDFDownloadLink document={<CVDocument />} fileName="Mert_Ali_Alkan_CV.pdf">
                            {({ loading }) => (
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.8rem 2rem',
                                        backgroundColor: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.borderColor = 'var(--text-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                    }}
                                >
                                    <FileText size={18} />
                                    {loading ? 'Hazırlanıyor...' : 'CV İndir'}
                                </div>
                            )}
                        </PDFDownloadLink>
                    </div>

                </div>
            </div>
        </section>
    );
}
