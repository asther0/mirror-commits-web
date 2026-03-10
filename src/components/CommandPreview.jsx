'use client';

import { useState } from 'react';

export default function CommandPreview({ config }) {
  const [copied, setCopied] = useState(false);
  const [copiedForAI, setCopiedForAI] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const generateCommand = () => {
    const lines = ['bash mirror.sh \\'];

    const emails = Array.isArray(config.emails)
      ? config.emails
      : config.emails.split(',').filter(Boolean);
    const repos = Array.isArray(config.repos)
      ? config.repos
      : config.repos.split(',').filter(Boolean);

    // --emails: one per line if multiple
    if (emails.length === 1) {
      lines.push(`  --emails "${emails[0]}" \\`);
    } else if (emails.length > 1) {
      lines.push(`  --emails "${emails.join(',')}" \\`);
    }

    // --repos: one per line for readability
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

    if (config.autoPush) {
      lines.push(`  --username "${config.githubUsername}" \\`);
      lines.push(`  --token "${config.githubToken}" \\`);
      lines.push('  --auto-push \\');
    }

    if (config.private) {
      lines.push('  --private \\');
    }

    if (config.dryRun) {
      lines.push('  --dry-run \\');
    }

    // Remove trailing backslash from last line
    const lastIndex = lines.length - 1;
    lines[lastIndex] = lines[lastIndex].replace(/ \\$/, '');

    return lines.join('\n');
  };

  /** Flat version for clipboard (single-line friendly) */
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

    if (config.autoPush) {
      parts.push(`--username "${config.githubUsername}"`);
      parts.push(`--token "${config.githubToken}"`);
      parts.push('--auto-push');
    }
    if (config.private) parts.push('--private');
    if (config.dryRun) parts.push('--dry-run');

    return parts.join(' \\\n  ');
  };

  const command = generateCommand();

  const copyToClipboard = async () => {
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

      const prompt = `Por favor, analiza este script bash que voy a ejecutar en mi computadora. Necesito que me ayudes a verificar su seguridad antes de ejecutarlo.

El script se llama "mirror.sh" y su propósito es crear un repositorio espejo en GitHub que refleje las fechas de mis commits de trabajo (sin código, solo timestamps) para actualizar mi gráfico de contribuciones.

Revisa específicamente:
1. ¿Hay comandos peligrosos o destructivos?
2. ¿Se expone información sensible o código fuente?
3. ¿Los permisos y operaciones con git son seguras?
4. ¿Hay riesgos de seguridad al usar el GitHub token?
5. ¿El script hace lo que dice que hace?

Aquí está el contenido completo del script:

\`\`\`bash
${scriptContent}
\`\`\`

Por favor dame un análisis detallado de seguridad y dime si es seguro ejecutarlo.`;

      await navigator.clipboard.writeText(prompt);
      setCopiedForAI(true);
      setTimeout(() => setCopiedForAI(false), 2000);
    } catch (err) {
      console.error('Failed to copy script for AI:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Generated Command */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Comando generado
          </h3>
          <button
            onClick={copyToClipboard}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              copied
                ? 'bg-accent text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="p-4 bg-slate-900">
          <pre className="text-sm text-slate-100 font-mono leading-relaxed whitespace-pre-wrap break-all">
            <code>{command}</code>
          </pre>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        {/* Main action - Download */}
        <button
          onClick={downloadScript}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar mirror.sh
        </button>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={copyToClipboard}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              copied
                ? 'bg-accent text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
            <span className="sm:hidden">{copied ? '✓' : 'Copiar'}</span>
          </button>

          <button
            onClick={copyScriptForAI}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              copiedForAI
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
            title="Copiar script con prompt para análisis en IA (Claude, ChatGPT)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">{copiedForAI ? '¡Copiado!' : 'Revisar con IA'}</span>
            <span className="sm:hidden">{copiedForAI ? '✓' : 'IA'}</span>
          </button>
        </div>

        {/* AI Review hint */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            ¿No confías aún? Usa "Revisar con IA" y pega en Claude/ChatGPT para un análisis de seguridad
          </span>
        </div>
      </div>

      {/* Collapsible Instructions */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>Como ejecutar</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInstructions && (
          <div className="px-4 pb-4 border-t border-slate-100">
            <ol className="space-y-3 mt-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <div>
                  Navega a tu carpeta de proyectos:
                  <code className="block bg-slate-100 px-2 py-1 rounded text-xs text-slate-800 font-mono mt-1">
                    cd ~/Projects
                  </code>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <div>
                  Dale permisos de ejecucion:
                  <code className="block bg-slate-100 px-2 py-1 rounded text-xs text-slate-800 font-mono mt-1">
                    chmod +x mirror.sh
                  </code>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                Pega y ejecuta el comando de arriba
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Security Notice - compact */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Seguridad:</span>{' '}
          Todo se ejecuta localmente. No se envia codigo, mensajes ni datos a ningun servidor. Solo se usan las fechas.
        </p>
      </div>
    </div>
  );
}
