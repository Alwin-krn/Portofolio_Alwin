import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-reveal animations using IntersectionObserver.
 * Adds 'active' class to elements with 'reveal' class when they enter viewport.
 */
export function useScrollReveal(dependencies = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const container = containerRef.current || document;
      const elements = container.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);

  return containerRef;
}
