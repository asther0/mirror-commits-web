'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ContributionGraph from '@/components/ContributionGraph';
import CommandBuilder from '@/components/CommandBuilder';
import CommandPreview from '@/components/CommandPreview';
import GitHubStars from '@/components/GitHubStars';
import TerminalPreview from '@/components/TerminalPreview';

export default function Home() {
  const [config, setConfig] = useState({
    emails: [], // Empty by default - will be filled by RepoScanner
    repos: [],
    mirrorName: 'work-mirror-2025',
    githubUsername: '',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Mirror Commits
          </h1>
          <GitHubStars repo="asther0/mirror-commits-web" />
        </div>
      </header>

      {/* Hero + Problem (fused) */}
      <HeroSection />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 -mt-4">
        <ContributionGraph />
      </section>

      {/* Cómo funciona - visual flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">
          Cómo funciona
        </h2>

        {/* Horizontal flow for desktop, vertical for mobile */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Step 1 */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Tus repos</h3>
            <p className="text-xs text-slate-500 mb-3">Clona y escanea</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-primary">●</span>
                <span>2025-03-10 (trabajo)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-primary">●</span>
                <span>2025-03-09 (trabajo)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>●</span>
                <span>247 commits...</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex lg:block justify-center">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300 lg:rotate-0 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">mirror.sh</h3>
            <p className="text-xs text-slate-500 mb-3">Crea commits vacíos</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2.5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Código:</span>
                <span className="text-red-500 font-semibold">✗ No</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Mensajes:</span>
                <span className="text-red-500 font-semibold">✗ No</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Fechas:</span>
                <span className="text-accent font-semibold">✓ Sí</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex lg:block justify-center">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300 lg:rotate-0 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex-1 bg-white border border-accent/30 rounded-xl p-5 text-center shadow-sm shadow-accent/10">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Tu GitHub</h3>
            <p className="text-xs text-slate-500 mb-3">Gráfico verde 🎉</p>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-3 py-3 border border-green-200">
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
              </div>
              <p className="text-xs text-green-700 font-semibold">247 contribuciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Section - Two Columns */}
      <section id="configurador" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
            Configura tu mirror
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Sigue los 4 pasos para generar y ejecutar el comando
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Left Column - Configuration (wider) */}
          <div className="w-full lg:col-span-3">
            <CommandBuilder config={config} updateConfig={updateConfig} />
          </div>

          {/* Right Column - Generated Script (sticky on desktop, normal on mobile) */}
          <div className="w-full lg:col-span-2 lg:sticky lg:top-20">
            <CommandPreview config={config} />
          </div>
        </div>
      </section>

      {/* Terminal Preview Section - After Configuration */}
      <TerminalPreview />

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-8 py-5 sm:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-slate-400 text-xs sm:text-sm">
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
