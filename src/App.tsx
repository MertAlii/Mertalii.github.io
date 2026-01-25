import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

import ScrollToTop from './components/ScrollToTop';
import FadeInSection from './components/FadeInSection';

function App() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const Separator = () => (
    <div className="container">
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '3rem 0' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        <section id="hero">
          <FadeInSection>
            <Hero />
          </FadeInSection>
        </section>
        <Separator />
        <section id="experience">
          <FadeInSection>
            <Experience />
          </FadeInSection>
        </section>
        <Separator />
        <section id="education">
          <FadeInSection>
            <Education />
          </FadeInSection>
        </section>
        <Separator />
        <section id="skills">
          <FadeInSection>
            <Skills />
          </FadeInSection>
        </section>
        <Separator />
        <section id="certifications">
          <FadeInSection>
            <Certifications />
          </FadeInSection>
        </section>
        <Separator />
        <section id="projects">
          <FadeInSection>
            <Projects theme={theme} />
          </FadeInSection>
        </section>
        <Separator />
        <section id="contact">
          <FadeInSection>
            <Contact />
          </FadeInSection>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
