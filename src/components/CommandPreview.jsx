'use client';

import { useState, useEffect } from 'react';

export default function CommandPreview({ config }) {
  const [copied, setCopied] = useState(false);
  const [copiedForAI, setCopiedForAI] = useState(false);
  const [hasVerifiedWithAI, setHasVerifiedWithAI] = useState(false);
  const [copyErrorType, setCopyErrorType] = useState(null); // 'validation' | 'clipboard' | null
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

  const step02Complete = hasUsername && hasMirrorName;
  const step03Complete = hasVerifiedWithAI;
  const step03Current = step02Complete && !hasVerifiedWithAI;
  const step04Current = hasVerifiedWithAI;

  const stepBadge = (stepNum, complete, current) => {
    if (complete) {
      return (
        <span className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center shrink-0" aria-label="Completado">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    if (current) {
      return (
        <span className="w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-slate-900 flex items-center justify-center text-xs font-mono font-semibold shrink-0 ring-2 ring-slate-900 ring-offset-2" aria-label="Paso actual">
          {stepNum}
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
        {stepNum}
      </span>
    );
  };

  const copyToClipboard = async () => {
    if (!isValid) {
      setCopyErrorType('validation');
      setTimeout(() => setCopyErrorType(null), 4000);
      return;
    }
    try {
      await navigator.clipboard.writeText(generateCopyCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyErrorType('clipboard');
      setTimeout(() => setCopyErrorType(null), 4000);
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
      {/* STEP 3: Verify with AI, then Download */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          {stepBadge('03', step03Complete, step03Current)}
          <div>
            <h3 className={`text-lg font-semibold ${step03Complete ? 'text-green-800' : 'text-slate-900'}`}>
              Verifica y descarga el script
              {step03Current && <span className="ml-2 text-sm font-normal text-slate-500">— Paso actual</span>}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">Primero copia el script para revisarlo con una IA. Luego descarga mirror.sh</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={copyScriptForAI}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-all border ${
              hasVerifiedWithAI
                ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                : copiedForAI
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:border-slate-800'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {copiedForAI ? 'Copiado — pega en tu IA (ChatGPT, Claude, etc.)' : 'Copiar y verificar con IA'}
          </button>

          <button
            onClick={downloadScript}
            disabled={!hasVerifiedWithAI || !isValid}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-all ${
              hasVerifiedWithAI && isValid
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            title={
              !hasVerifiedWithAI
                ? 'Marca que ya revisaste el script con una IA'
                : !isValid
                ? 'Completa repositorios, emails, usuario y nombre del mirror en los pasos anteriores'
                : ''
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar mirror.sh
          </button>
        </div>

        <label className={`flex items-center gap-3 mt-4 group ${!step02Complete ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
          <input
            type="checkbox"
            checked={hasVerifiedWithAI}
            onChange={(e) => setHasVerifiedWithAI(e.target.checked)}
            disabled={!step02Complete}
            className="w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-400 disabled:cursor-not-allowed"
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-800">
            {step02Complete
              ? 'He revisado el script con una IA (ChatGPT, Claude, etc.) y quiero descargar mirror.sh'
              : 'Completa el paso 02 (Destino) para poder marcar esta verificación'}
          </span>
        </label>
      </section>

      {/* STEP 4: Execute */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          {stepBadge('04', false, step04Current)}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Ejecuta en tu terminal
              {step04Current && <span className="ml-2 text-sm font-normal text-slate-500">— Paso actual</span>}
            </h3>
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
              type="button"
              onClick={copyToClipboard}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative z-10 shrink-0 ${
                !isValid
                  ? 'bg-slate-800 text-slate-500 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                  : copied
                  ? 'bg-slate-800 text-green-400 border border-green-400/50'
                  : 'bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:text-white'
              }`}
              title={!isValid ? 'Completa los campos requeridos' : 'Copiar comando'}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
          <div className="p-5 sm:p-6">
            <pre className="text-base text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
              <code>{command}</code>
            </pre>
          </div>
        </div>

        {copyErrorType === 'validation' && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Completa repositorios, emails, usuario de GitHub y nombre del mirror arriba para poder copiar el comando.
          </p>
        )}
        {copyErrorType === 'clipboard' && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            No se pudo copiar al portapapeles. Comprueba que el sitio use HTTPS (o localhost) y que el navegador tenga permiso para acceder al portapapeles.
          </p>
        )}

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
    </div>
  );
}
