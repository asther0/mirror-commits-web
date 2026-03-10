'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ContributionGraph from '@/components/ContributionGraph';
import CommandBuilder from '@/components/CommandBuilder';
import CommandPreview from '@/components/CommandPreview';
import GitHubStars from '@/components/GitHubStars';

export default function Home() {
  const [config, setConfig] = useState({
    emails: ['jhomar@empresa.pe'],
    repos: ['https://github.com/asther0/mirror-commits-web'],
    mirrorName: 'work-mirror-2025',
    githubUsername: 'asther0',
    githubToken: '',
    autoPush: false,
    dryRun: false,
    private: false,
  });

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            Mirror Commits
          </h1>
          <GitHubStars repo="asther0/mirror-commits-web" />
        </div>
      </header>

      {/* Hero + Problem (fused) */}
      <HeroSection />
      <section className="max-w-5xl mx-auto px-6 pb-16 -mt-4">
        <ContributionGraph />
      </section>

      {/* Origen -> Proceso -> Destino (visual flow) */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
          Cómo funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Origen */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Origen</h3>
            <p className="text-sm text-slate-500">
              Tus repos de trabajo con commits hechos con tu email laboral
            </p>
          </div>

          {/* Proceso */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center card-hover">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Proceso</h3>
            <p className="text-sm text-slate-500">
              Extrae solo las fechas de los commits, sin código ni mensajes
            </p>
          </div>

          {/* Destino */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Destino</h3>
            <p className="text-sm text-slate-500">
              Tu repo mirror personal con los timestamps reflejados
            </p>
          </div>
        </div>
      </section>

      {/* Configuration Section - Two Columns */}
      <section id="configurador" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Configura tu mirror
          </h2>
          <p className="text-slate-500">
            Sigue los 4 pasos para generar y ejecutar el comando
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Column - Configuration (wider) */}
          <div className="lg:col-span-3">
            <CommandBuilder config={config} updateConfig={updateConfig} />
          </div>

          {/* Right Column - Generated Script (sticky) */}
          <div className="lg:col-span-2 lg:sticky lg:top-20">
            <CommandPreview config={config} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-8 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>
            Inspirado en{' '}
            <a
              href="https://github.com/petarran/shomei"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              shomei
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
