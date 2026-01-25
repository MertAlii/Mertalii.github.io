import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#hero", label: "Hakkımda" },
    { href: "#experience", label: "Deneyim" },
    { href: "#education", label: "Eğitim" },
    { href: "#skills", label: "Yetkinlikler" },
    { href: "#certifications", label: "Sertifikalar" },
    { href: "#projects", label: "Projeler" },
    { href: "#contact", label: "İletişim" }
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10001, // Ensure header is above overlay
          backgroundColor: 'rgba(var(--bg-rgb), 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 2rem' }}>
          <TypewriterLogo />

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                color: 'var(--bg-primary)',
                backgroundColor: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                zIndex: 1001
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                color: 'var(--text-primary)',
                zIndex: 10000, // Ensure it is above the overlay (9999)
                display: 'none', // Handled by CSS
                padding: '0.5rem'
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme === 'dark' ? 'rgba(10, 10, 10, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingTop: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          zIndex: 10000 // Below header (10001) but above content
        }}>
          {/* Explicit Close Button inside Overlay */}
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '25px',
              color: 'var(--text-primary)',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ... (NavLinks component remains)

function TypewriterLogo() {
  const [text, setText] = useState('Alkan');
  const [isHovered, setIsHovered] = useState(false);

  const targetText = isHovered ? "Mert Ali Alkan" : "Alkan";

  useEffect(() => {
    if (text === targetText) return;

    // Determine action: Delete or Type
    // If current text is NOT a prefix of the target, we must delete.
    // If it IS a prefix, we type the next character to match target.
    const isDeleting = !targetText.startsWith(text);
    const speed = isDeleting ? 50 : 100; // Delete faster than typing

    const timeout = setTimeout(() => {
      setText(prev => {
        if (isDeleting) {
          return prev.slice(0, -1);
        } else {
          return targetText.slice(0, prev.length + 1);
        }
      });
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, targetText]);

  return (
    <a
      href="#"
      style={{
        fontWeight: 800,
        fontSize: '1.5rem',
        letterSpacing: '-0.03em',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        zIndex: 1001,
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: '50px' // Prevent layout shift jitter during empty state
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      <span style={{
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--accent-color)',
        marginLeft: '2px',
        animation: isHovered ? 'blink 1s step-end infinite' : 'none',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.2s'
      }} />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </a>
  );
}

function NavLink({ href, label }: { href: string, label: string }) {
  return (
    <a
      href={href}
      style={{
        fontSize: '0.95rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        transition: 'color 0.2s',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
    >
      {label}
    </a>
  );
}
