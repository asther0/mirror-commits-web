'use client';

import { useState } from 'react';
import CommandBuilder from '@/components/CommandBuilder';
import CommandPreview from '@/components/CommandPreview';

export default function Home() {
  const [config, setConfig] = useState({
    emails: 'jhomar@empresa.pe,jhomar.astuyauri@gmail.com',
    repos: 'Fashion-Extension,Keepers-App,SneakerMatch',
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Mirror Commits</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Problem & Solution Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  El Problema
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Has estado programando todo el año en tu trabajo, pero tu GitHub personal aparece vacío porque usas un email diferente para commits laborales.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  La Solución
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Refleja tus commits de trabajo (solo timestamps) en tu GitHub personal. Sin código, sin mensajes de commit, sin nombres de archivos. Solo la actividad.
                </p>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="w-64 h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Imagen opcional</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div>
            <CommandBuilder config={config} updateConfig={updateConfig} />
          </div>

          {/* Right Column - Generated Script */}
          <div>
            <CommandPreview config={config} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>
            Inspirado en{' '}
            <a
              href="https://github.com/petarran/shomei"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              shōmei
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
