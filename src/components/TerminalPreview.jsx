'use client';

import { useState, useEffect } from 'react';

/**
 * Component that simulates the terminal output of the mirror.sh script
 * Shows what the user can expect to see when running the script
 */
export default function TerminalPreview() {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    // Detect if user is on Windows
    setIsWindows(navigator.platform.toLowerCase().includes('win'));
  }, []);

  // Simulated terminal output lines with timestamps
  const outputLines = [
    { text: '$ bash mirror.sh --emails "jhomar@empresa.pe" --repos "https://github.com/asther0/my-work-repo" --name "work-mirror-2025" --username "asther0"', type: 'command' },
    { text: '', type: 'blank' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'neutral' },
    { text: '  Mirror Commits - Contribution Graph Fix', type: 'info' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'neutral' },
    { text: '', type: 'blank' },
    { text: 'Configuration:', type: 'info' },
    { text: '  Emails: 1', type: 'neutral' },
    { text: '  Repos: 1', type: 'neutral' },
    { text: '  Mirror: work-mirror-2025', type: 'neutral' },
    { text: '', type: 'blank' },
    { text: 'Scanning repos...', type: 'info' },
    { text: '  Cloning https://github.com/asther0/my-work-repo...', type: 'info' },
    { text: '  ✓ https://github.com/asther0/my-work-repo: 247 commits', type: 'success' },
    { text: '', type: 'blank' },
    { text: 'Total: 247 commits', type: 'success' },
    { text: '', type: 'blank' },
    { text: 'Creating mirror repository...', type: 'info' },
    { text: 'Creating 247 mirror commits...', type: 'info' },
    { text: '✓ Created 247 commits', type: 'success' },
    { text: '', type: 'blank' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'neutral' },
    { text: '✓ Success! Local repository created.', type: 'success' },
    { text: '', type: 'blank' },
    { text: 'To push manually:', type: 'warning' },
    { text: '', type: 'blank' },
    { text: 'cd "work-mirror-2025"', type: 'neutral' },
    { text: 'git remote add origin https://github.com/asther0/work-mirror-2025.git', type: 'neutral' },
    { text: 'git branch -M main', type: 'neutral' },
    { text: 'git push -u origin main', type: 'neutral' },
    { text: '', type: 'blank' },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'neutral' },
  ];

  useEffect(() => {
    if (!isPlaying || currentLine >= outputLines.length) return;

    const timer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 200); // Speed of animation

    return () => clearTimeout(timer);
  }, [currentLine, isPlaying, outputLines.length]);

  const handlePlay = () => {
    if (currentLine >= outputLines.length) {
      setCurrentLine(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentLine(0);
    setIsPlaying(false);
  };

  // Map output line types to color classes
  const getLineColor = (type) => {
    switch (type) {
      case 'command':
        return 'text-blue-300';
      case 'info':
        return 'text-cyan-300';
      case 'success':
        return 'text-green-300';
      case 'warning':
        return 'text-yellow-300';
      case 'tip':
        return 'text-purple-300';
      case 'neutral':
        return 'text-slate-300';
      case 'blank':
        return 'text-slate-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
          Preview del terminal
        </h2>
        <p className="text-slate-500 text-sm px-4 mb-2">
          Esto es lo que verás cuando ejecutes el comando
        </p>
        {isWindows && (
          <p className="text-xs text-blue-600 font-medium px-4">
            (en Git Bash o WSL, no en PowerShell)
          </p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Terminal header bar */}
        <div className="bg-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-slate-400 ml-2 sm:ml-3 font-mono">bash</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying && currentLine < outputLines.length}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                currentLine >= outputLines.length
                  ? 'bg-primary hover:bg-primary-dark text-white'
                  : isPlaying
                  ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-dark text-white hover:shadow-md'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentLine >= outputLines.length ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8.707 5.293a1 1 0 00-1.414-1.414L10 10.172l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2z" />
                  </svg>
                  Ver de nuevo
                </>
              ) : isPlaying ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reproduciendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Ver simulación
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              title="Reiniciar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal content */}
        <div className="bg-slate-900 p-4 sm:p-6 min-h-[350px] sm:min-h-[400px] max-h-[450px] sm:max-h-[500px] overflow-y-auto">
          <div className="font-mono text-xs sm:text-sm space-y-1">
            {outputLines.slice(0, currentLine).map((line, index) => (
              <div
                key={index}
                className={`${getLineColor(line.type)} leading-relaxed animate-fade-in`}
                style={{
                  animationDelay: '0ms',
                  animationDuration: '150ms',
                  animationFillMode: 'both'
                }}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
            {currentLine < outputLines.length && isPlaying && (
              <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse"></span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center max-w-md mx-auto">
        El script solo copia las fechas de tus commits. No se copia código, mensajes, ni datos sensibles.
      </p>
    </section>
  );
}
