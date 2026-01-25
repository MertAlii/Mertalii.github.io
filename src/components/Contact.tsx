import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Contact() {
    return (
        <section className="container" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={24} />
                İletişim
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    Benimle iletişime geçmek, projelerim hakkında konuşmak veya sadece tanışmak için aşağıdaki platformları kullanabilirsiniz.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    <ContactLink href="https://github.com/MertAlii" icon={<Github size={20} />} label="GitHub" username="@MertAlii" />
                    <ContactLink href="https://www.linkedin.com/in/mer1alii/" icon={<Linkedin size={20} />} label="LinkedIn" username="Mert Ali Alkan" />
                    <ContactLink href="https://www.instagram.com/mer1.alii/" icon={<Instagram size={20} />} label="Instagram" username="@mer1.alii" />
                    <ContactLink href="mailto:mertali.al5555@gmail.com" icon={<Mail size={20} />} label="Email" username="mertali.al5555@gmail.com" />
                </div>
            </div>
        </section>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContactLink({ href, icon, label, username }: { href: string, icon: any, label: string, username: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'transform 0.2s, border-color 0.2s'
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
            <div style={{
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{username}</span>
            </div>
        </a>
    );
}
