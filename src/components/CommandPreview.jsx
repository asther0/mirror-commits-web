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
    const emails = Array.isArray(config.emails) ? config.emails : config.emails.split(',').filter(Boolean);
    const repos = Array.isArray(config.repos) ? config.repos : config.repos.split(',').filter(Boolean);

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
    if (config.private) lines.push('  --private \\');
    if (config.dryRun) lines.push('  --dry-run \\');

    const lastIndex = lines.length - 1;
    lines[lastIndex] = lines[lastIndex].replace(/ \\$/, '');
    return lines.join('\n');
  };

  const generateCopyCommand = () => {
    const emails = Array.isArray(config.emails) ? config.emails.join(',') : config.emails;
    const repos = Array.isArray(config.repos) ? config.repos.join(',') : config.repos;
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
      const prompt = `Analiza la seguridad de este script bash antes de ejecutarlo.\n\nPropósito: crear un repo espejo en GitHub con timestamps de commits (sin código) para actualizar el contribution graph.\n\n¿Es seguro ejecutarlo? ¿Hay comandos peligrosos o filtraciones de información?\n\n\`\`\`bash\n${scriptContent}\n\`\`\``;
      await navigator.clipboard.writeText(prompt);
      setCopiedForAI(true);
      setTimeout(() => setCopiedForAI(false), 3000);
    } catch (err) {
      console.error('Failed to copy script for AI:', err);
    }
  };

  return (
    <div className="space-y-10">
      {/* STEP 3: Download */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-xs font-mono text-slate-400">03</span>
          <h3 className="text-base font-semibold text-slate-900">Descarga el script</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadScript}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar mirror.sh
          </button>

          <button
            onClick={copyScriptForAI}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
              copiedForAI
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {copiedForAI ? 'Copiado!' : 'Verificar con IA'}
          </button>
        </div>
      </section>

      {/* STEP 4: Execute */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-xs font-mono text-slate-400">04</span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ejecuta en tu terminal</h3>
            <p className="text-xs text-slate-400 mt-0.5">En la carpeta donde guardaste mirror.sh</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!isValid}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                !isValid
                  ? 'text-slate-600 cursor-not-allowed'
                  : copied
                  ? 'text-green-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={!isValid ? 'Completa los campos requeridos' : ''}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="p-4">
            <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
              <code>{command}</code>
            </pre>
          </div>
        </div>

        {isWindows && (
          <button
            onClick={() => setShowWindowsHelp(!showWindowsHelp)}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showWindowsHelp ? 'Ocultar ayuda' : 'Usa Git Bash en Windows para ejecutar'}
          </button>
        )}

        {isWindows && showWindowsHelp && (
          <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            PowerShell/CMD no soportan bash. Abre <strong>Git Bash</strong> y ejecuta el comando ahí.
            ¿No lo tienes?{' '}
            <a href="https://gitforwindows.org/" target="_blank" rel="noopener noreferrer" className="underline">
              Instala Git for Windows
            </a>
          </p>
        )}

        <p className="text-xs text-slate-400 mt-4">
          Todo corre en tu terminal. No se envía nada a ningún servidor.
        </p>
      </section>
    </div>
  );
}
