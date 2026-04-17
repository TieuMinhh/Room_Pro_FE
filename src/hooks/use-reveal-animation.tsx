
import { useEffect, useRef } from 'react';

export const useRevealAnimation = () => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      revealItems.forEach((item) => observer.unobserve(item));
    };
  }, []);

  return revealRef;
};

export default useRevealAnimation;
