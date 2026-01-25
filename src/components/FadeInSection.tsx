import { useState, useRef, useEffect, type ReactNode } from 'react';

interface FadeInSectionProps {
    children: ReactNode;
    delay?: string;
}

export default function FadeInSection({ children, delay = '0s' }: FadeInSectionProps) {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Once visible, we can stop observing if we want it to only fade in once
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
        });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${delay}, transform 0.6s ease-out ${delay}`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
}
