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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 animate-fade-in-up text-balance">
          Refleja tus commits de{' '}
          <span
            className={`inline-block text-slate-500 transition-all duration-200 ${
              isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {WORDS[wordIndex]}
          </span>
          {' '}en tu GitHub
        </h2>
        <p className="text-base sm:text-lg text-slate-500 mb-8 max-w-xl mx-auto animate-fade-in-up animation-delay-100 text-balance">
          Tu contribution graph aparece vacío porque los commits van con otro email.
        </p>

        <button
          onClick={handleScrollToConfig}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors animate-fade-in-up animation-delay-200"
        >
          Empezar
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex justify-center gap-6 mt-10 animate-fade-in-up animation-delay-300">
          <span className="text-xs text-slate-400">Corre en tu terminal</span>
          <span className="text-slate-200">|</span>
          <span className="text-xs text-slate-400">No sube tu código</span>
          <span className="text-slate-200">|</span>
          <span className="text-xs text-slate-400">Solo copia fechas</span>
        </div>
      </div>
    </section>
  );
}
