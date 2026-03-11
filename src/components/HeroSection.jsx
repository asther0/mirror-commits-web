'use client';

import { useState, useEffect } from 'react';
import ContributionGraph from '@/components/ContributionGraph';

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
    <section className="pt-10 pb-6 sm:pt-12 sm:pb-8 lg:pt-16 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left: Text + CTA */}
          <div className="text-center lg:text-left mb-10 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 animate-fade-in-up text-balance">
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
            <p className="text-sm sm:text-base text-slate-500 mb-6 max-w-md mx-auto lg:mx-0 animate-fade-in-up animation-delay-100 text-balance">
              Tu contribution graph aparece vacío porque los commits van con otro email.
            </p>

            <button
              onClick={handleScrollToConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors animate-fade-in-up animation-delay-200"
            >
              Empezar
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="flex justify-center lg:justify-start gap-6 mt-6 animate-fade-in-up animation-delay-300">
              <span className="text-xs text-slate-400">Corre en tu terminal</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-400">No sube tu código</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-400">Solo copia fechas</span>
            </div>
          </div>

          {/* Right: Contribution graphs */}
          <div className="w-full animate-fade-in-up animation-delay-200">
            <ContributionGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
