'use client';

import { useState, use } from 'react';
import HeroSection from '@/components/HeroSection';
import CommandBuilder from '@/components/CommandBuilder';
import CommandPreview from '@/components/CommandPreview';
import GitHubStars from '@/components/GitHubStars';

export default function Home({ params, searchParams }) {
  // Unwrap Next.js 15 dynamic APIs
  if (params) use(params);
  if (searchParams) use(searchParams);
  const [config, setConfig] = useState({
    emails: [],
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-slate-900">Mirror Commits</h1>
          <GitHubStars repo="asther0/mirror-commits-web" />
        </div>
      </header>

      <HeroSection />

      {/* Configurator */}
      <section id="configurador" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-14">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Configura tu mirror</h2>
          <p className="text-sm text-slate-400 mt-1">Completa los pasos y ejecuta el comando en tu terminal</p>
        </div>

        <div className="space-y-10">
          <CommandBuilder config={config} updateConfig={updateConfig} />
          <CommandPreview config={config} />
        </div>
      </section>

      <footer className="border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center text-slate-400 text-xs">
          Inspirado en{' '}
          <a
            href="https://github.com/petarran/shomei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:underline"
          >
            shomei
          </a>
        </div>
      </footer>
    </div>
  );
}
