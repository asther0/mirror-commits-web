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
    <div className="space-y-12">
      {/* STEP 3: Download */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">03</span>
          <h3 className="text-lg font-semibold text-slate-900">Descarga el script</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadScript}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-base font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar mirror.sh
          </button>

          <button
            onClick={copyScriptForAI}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-all border ${
              copiedForAI
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {copiedForAI ? 'Copiado!' : 'Verificar con IA'}
          </button>
        </div>
      </section>

      {/* STEP 4: Execute */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">04</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Ejecuta en tu terminal</h3>
            <p className="text-sm text-slate-400 mt-0.5">En la carpeta donde guardaste mirror.sh</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!isValid}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
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
          <div className="p-5 sm:p-6">
            <pre className="text-base text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
              <code>{command}</code>
            </pre>
          </div>
        </div>

        {isWindows && (
          <button
            onClick={() => setShowWindowsHelp(!showWindowsHelp)}
            className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showWindowsHelp ? 'Ocultar ayuda' : 'Usa Git Bash en Windows para ejecutar'}
          </button>
        )}

        {isWindows && showWindowsHelp && (
          <p className="mt-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
            PowerShell/CMD no soportan bash. Abre <strong>Git Bash</strong> y ejecuta el comando ahí.
            ¿No lo tienes?{' '}
            <a href="https://gitforwindows.org/" target="_blank" rel="noopener noreferrer" className="underline">
              Instala Git for Windows
            </a>
          </p>
        )}

        <p className="text-sm text-slate-400 mt-4">
          Todo corre en tu terminal. No se envía nada a ningún servidor.
        </p>
      </section>

      {/* STEP 5: Manual Push (only if not auto-push) */}
      {!config.autoPush && hasUsername && hasMirrorName && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">05</span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sube el repo a GitHub</h3>
              <p className="text-sm text-slate-400 mt-0.5">Después de ejecutar el script</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Primero, crea un nuevo repositorio en GitHub llamado <code className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-mono text-sm">{config.mirrorName}</code>
            </p>

            <a
              href={`https://github.com/new?name=${config.mirrorName}&description=Mirror+of+work+commits`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-base font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Crear repositorio en GitHub
            </a>

            <p className="text-sm text-slate-600">
              Luego, ejecuta estos comandos en tu terminal:
            </p>

            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6">
                <pre className="text-base text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
                  <code>{`cd "${config.mirrorName}"
git remote add origin https://github.com/${config.githubUsername}/${config.mirrorName}.git
git branch -M main
git push -u origin main`}</code>
                </pre>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Una vez subido, verás tus commits en{' '}
              <a
                href={`https://github.com/${config.githubUsername}/${config.mirrorName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:underline"
              >
                github.com/{config.githubUsername}/{config.mirrorName}
              </a>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
