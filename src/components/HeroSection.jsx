'use client';

export default function HeroSection() {
  const handleScrollToConfig = () => {
    const element = document.getElementById('configurador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-gradient py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 animate-fade-in-up text-balance">
          Tu trabajo merece ser visto
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100 text-balance">
          Refleja tu actividad laboral en tu GitHub personal sin compartir codigo privado.
          Solo timestamps, cero secretos.
        </p>

        <button
          onClick={handleScrollToConfig}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 animate-fade-in-up animation-delay-200"
        >
          Empezar ahora
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 animate-fade-in-up animation-delay-300">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% local
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sin codigo fuente
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Solo timestamps
          </div>
        </div>
      </div>
    </section>
  );
}
