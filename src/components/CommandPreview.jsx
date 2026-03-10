'use client';

import { useState } from 'react';

export default function CommandPreview({ config }) {
  const [copied, setCopied] = useState(false);
  const [copiedForAI, setCopiedForAI] = useState(false);

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

      const prompt = `Analiza este script bash que voy a ejecutar en mi computadora. Necesito que me ayudes a verificar su seguridad antes de ejecutarlo.

El script se llama "mirror.sh" y su proposito es crear un repositorio espejo en GitHub que refleje las fechas de mis commits de trabajo (sin codigo, solo timestamps) para actualizar mi grafico de contribuciones.

Revisa especificamente:
1. Hay comandos peligrosos o destructivos?
2. Se expone informacion sensible o codigo fuente?
3. Los permisos y operaciones con git son seguras?
4. Hay riesgos de seguridad al usar el GitHub token?
5. El script hace lo que dice que hace?

Aqui esta el contenido completo del script:

\`\`\`bash
${scriptContent}
\`\`\`

Dame un analisis detallado de seguridad y dime si es seguro ejecutarlo.`;

      await navigator.clipboard.writeText(prompt);
      setCopiedForAI(true);
      setTimeout(() => setCopiedForAI(false), 3000);
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

      {/* Actions */}
      <div className="space-y-3">
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
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            copiedForAI
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 hover:border-purple-200'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {copiedForAI ? 'Copiado! Pegalo en ChatGPT o Claude' : 'Verificar seguridad de mirror.sh con IA'}
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Seguridad:</span>{' '}
          Todo se ejecuta localmente. No se envia codigo, mensajes ni datos a ningun servidor. Solo se usan las fechas.
        </p>
      </div>
    </div>
  );
}
