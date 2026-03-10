'use client';

import { useState, useEffect } from 'react';

const WORDS = ['trabajo', 'freelos', 'empresa', 'clientes', 'la uni'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsAnimating(false);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleScrollToConfig = () => {
    const element = document.getElementById('configurador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-gradient py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 animate-fade-in-up text-balance">
          Refleja tus commits de{' '}
          <span
            className={`inline-block text-primary transition-all duration-200 ${
              isAnimating
                ? 'opacity-0 translate-y-2'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {WORDS[wordIndex]}
          </span>
          {' '}en tu GitHub
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100 text-balance px-4">
          Programas todo el año pero tu contribution graph aparece vacío
          porque los commits van con otro email.
        </p>

        <button
          onClick={handleScrollToConfig}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 animate-fade-in-up animation-delay-200 text-sm sm:text-base"
        >
          Empezar ahora
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 animate-fade-in-up animation-delay-300 px-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="whitespace-nowrap">Corre en tu terminal</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="whitespace-nowrap">No sube tu código</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="whitespace-nowrap">Solo copia fechas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
