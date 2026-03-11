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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-slate-900">Mirror Commits</h1>
          <GitHubStars repo="asther0/mirror-commits-web" />
        </div>
      </header>

      <HeroSection />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 -mt-4">
        <ContributionGraph />
      </section>

      {/* Single column configurator */}
      <section id="configurador" className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-10">
          <CommandBuilder config={config} updateConfig={updateConfig} />
          <CommandPreview config={config} />
        </div>
      </section>

      <TerminalPreview />

      <footer className="border-t border-slate-100 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-slate-400 text-xs">
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
