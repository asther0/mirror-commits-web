'use client';

import { useState, useEffect } from 'react';

export default function CommandPreview({ config }) {
  const [copied, setCopied] = useState(false);
  const [copiedForAI, setCopiedForAI] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [showWindowsHelp, setShowWindowsHelp] = useState(false);

  useEffect(() => {
    setIsWindows(navigator.platform.toLowerCase().includes('win'));
  }, []);

  const generateCommand = () => {
    const lines = ['bash mirror.sh \\'];

    const emails = Array.isArray(config.emails)
      ? config.emails
      : config.emails.split(',').filter(Boolean);
    const repos = Array.isArray(config.repos)
      ? config.repos
      : config.repos.split(',').filter(Boolean);

    if (emails.length === 1) {
      lines.push(`  --emails "${emails[0]}" \\`);
    } else if (emails.length > 1) {
      lines.push(`  --emails "${emails.join(',')}" \\`);
    }

    if (repos.length === 1) {
      lines.push(`  --repos "${repos[0]}" \\`);
    } else if (repos.length > 1) {
      lines.push('  --repos "\\');
      repos.forEach((repo, index) => {
        const separator = index < repos.length - 1 ? ',' : '';
        lines.push(`    ${repo}${separator}`);
      });
      lines.push('  " \\');
    }

    lines.push(`  --name "${config.mirrorName}" \\`);
    lines.push(`  --username "${config.githubUsername}" \\`);

    if (config.autoPush) {
      lines.push(`  --token "${config.githubToken}" \\`);
      lines.push('  --auto-push \\');
    }

    if (config.private) {
      lines.push('  --private \\');
    }

    if (config.dryRun) {
      lines.push('  --dry-run \\');
    }

    const lastIndex = lines.length - 1;
    lines[lastIndex] = lines[lastIndex].replace(/ \\$/, '');

    return lines.join('\n');
  };

  const generateCopyCommand = () => {
    const emails = Array.isArray(config.emails)
      ? config.emails.join(',')
      : config.emails;
    const repos = Array.isArray(config.repos)
      ? config.repos.join(',')
      : config.repos;

    const parts = ['bash mirror.sh'];
    parts.push(`--emails "${emails}"`);
    parts.push(`--repos "${repos}"`);
    parts.push(`--name "${config.mirrorName}"`);
    parts.push(`--username "${config.githubUsername}"`);

    if (config.autoPush) {
      parts.push(`--token "${config.githubToken}"`);
      parts.push('--auto-push');
    }
    if (config.private) parts.push('--private');
    if (config.dryRun) parts.push('--dry-run');

    return parts.join(' \\\n  ');
  };

  const command = generateCommand();

  const hasEmails = config.emails && (Array.isArray(config.emails) ? config.emails.length > 0 : config.emails.trim() !== '');
  const hasRepos = config.repos && (Array.isArray(config.repos) ? config.repos.length > 0 : config.repos.trim() !== '');
  const hasMirrorName = config.mirrorName && config.mirrorName.trim() !== '';
  const hasUsername = config.githubUsername && config.githubUsername.trim() !== '';
  const hasToken = !config.autoPush || (config.githubToken && config.githubToken.trim() !== '');

  const isValid = hasEmails && hasRepos && hasMirrorName && hasUsername && hasToken;

  const copyToClipboard = async () => {
    if (!isValid) return;
    try {
      await navigator.clipboard.writeText(generateCopyCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadScript = () => {
    const link = document.createElement('a');
    link.href = '/scripts/mirror.sh';
    link.download = 'mirror.sh';
    link.click();
  };

  const copyScriptForAI = async () => {
    try {
      const response = await fetch('/scripts/mirror.sh');
      const scriptContent = await response.text();

      const prompt = `Analiza la seguridad de este script bash antes de ejecutarlo.

Propósito: crear un repo espejo en GitHub con timestamps de commits (sin código) para actualizar el contribution graph.

¿Es seguro ejecutarlo? ¿Hay comandos peligrosos o filtraciones de información?

\`\`\`bash
${scriptContent}
\`\`\``;

      await navigator.clipboard.writeText(prompt);
      setCopiedForAI(true);
      setTimeout(() => setCopiedForAI(false), 3000);
    } catch (err) {
      console.error('Failed to copy script for AI:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* PASO 3: Descarga el script */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            3
          </span>
          <h3 className="font-semibold text-slate-900 text-sm">Descarga el script</h3>
        </div>

        <div className="space-y-2 mt-4">
          <button
            onClick={downloadScript}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar mirror.sh
          </button>

          <button
            onClick={copyScriptForAI}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              copiedForAI
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {copiedForAI ? 'Copiado! Pegalo en ChatGPT o Claude' : 'Verificar seguridad con IA'}
          </button>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* PASO 4: Copia y ejecuta */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            4
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Copia y ejecuta en tu terminal</h3>
            <p className="text-xs text-slate-400">En la misma carpeta donde guardaste mirror.sh</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-slate-700/50">
            <span className="text-xs text-slate-500 font-mono">terminal</span>
            <button
              onClick={copyToClipboard}
              disabled={!isValid}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all shrink-0 ${
                !isValid
                  ? 'text-slate-600 cursor-not-allowed'
                  : copied
                  ? 'bg-accent text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={!isValid ? 'Completa los campos requeridos' : ''}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="p-3 sm:p-4">
            <pre className="text-xs sm:text-sm text-slate-100 font-mono leading-relaxed whitespace-pre-wrap break-all">
              <code>{command}</code>
            </pre>
          </div>
        </div>

        {/* Windows Warning */}
        {isWindows && (
          <div className="mt-3">
            <button
              onClick={() => setShowWindowsHelp(!showWindowsHelp)}
              className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-4 py-2.5 transition-colors text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-blue-800">
                  <strong>Windows:</strong> Usa Git Bash para ejecutar
                </span>
                <svg
                  className={`w-4 h-4 text-blue-600 transition-transform shrink-0 ${showWindowsHelp ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showWindowsHelp && (
              <div className="mt-2 bg-white border border-blue-200 rounded-lg px-4 py-3 animate-fade-in">
                <p className="text-xs text-slate-600">
                  PowerShell/CMD no soportan bash. Abre <strong className="text-slate-800">Git Bash</strong> y ejecuta el comando ahí.
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  ¿No lo tienes? Instala{' '}
                  <a
                    href="https://gitforwindows.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Git for Windows
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-3">
          Todo corre en tu terminal. No se envía nada a ningún servidor.
        </p>
      </section>
    </div>
  );
}
