import { Briefcase } from 'lucide-react';
import { experience } from '../data';

export default function Experience() {
    return (
        <section className="container" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Briefcase size={24} />
                Deneyim
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {experience.map((exp, index) => (
                    <ExperienceItem
                        key={index}
                        title={exp.title}
                        company={`${exp.company} · ${exp.type}`}
                        date={exp.date}
                        description={exp.description}
                        tags={exp.tags}
                    />
                ))}
            </div>
        </section>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExperienceItem({ title, company, date, description, tags }: { title: string, company: string, date: string, description: string, tags?: string[] }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1.5rem', // Added padding
            backgroundColor: 'var(--card-bg)', // Added background
            borderRadius: '12px', // Added radius
            border: '1px solid var(--border-color)', // Added border
            transition: 'transform 0.2s, border-color 0.2s' // Added transition
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{date}</span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>{company}</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'justify', marginBottom: tags && tags.length > 0 ? '0.75rem' : '0' }}>
                {description}
            </p>
            {tags && tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tags.map((tag, index) => (
                        <span key={index} style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'rgba(0,0,0,0.05)', // Slightly darkening the tag bg inside the card
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            fontWeight: 500
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
