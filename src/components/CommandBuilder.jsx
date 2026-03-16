'use client';

import TagInput from '@/components/TagInput';
import RepoScanner from '@/components/RepoScanner';

export default function CommandBuilder({ config, updateConfig }) {
  const hasRepos = config.repos && config.repos.length > 0;
  const hasEmails = config.emails && (Array.isArray(config.emails) ? config.emails.length > 0 : String(config.emails).trim() !== '');
  const hasUsername = config.githubUsername && config.githubUsername.trim() !== '';
  const hasMirrorName = config.mirrorName && config.mirrorName.trim() !== '';

  const step01Complete = hasRepos && hasEmails;
  const step02Complete = hasUsername && hasMirrorName;
  const step01Current = !step01Complete;
  const step02Current = step01Complete && !step02Complete;

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

  return (
    <div className="space-y-12">
      {/* STEP 1 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          {stepBadge('01', step01Complete, step01Current)}
          <div>
            <h3 className={`text-lg font-semibold ${step01Complete ? 'text-green-800' : 'text-slate-900'}`}>
              Repositorios y emails
              {step01Current && <span className="ml-2 text-sm font-normal text-slate-500">— Paso actual</span>}
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Repositorios de trabajo <span className="text-slate-400">*</span>
            </label>
            <TagInput
              value={config.repos}
              onChange={(newRepos) => updateConfig('repos', newRepos)}
              placeholder="https://github.com/usuario/repo"
              type="url"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Emails de tus commits <span className="text-slate-400">*</span>
            </label>
            <p className="text-sm text-slate-400 mb-3">
              Escanea tus repos para detectarlos automáticamente
            </p>
            <RepoScanner
              repos={config.repos}
              selectedEmails={config.emails || []}
              onEmailsChange={(newEmails) => updateConfig('emails', newEmails)}
              scanToken={config.scanToken}
              onTokenRequired={() => updateConfig('needsToken', true)}
            />

            {config.needsToken && (
              <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-amber-800">
                      Algunos repositorios son privados. Necesitas un token de GitHub.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={config.scanToken || ''}
                        onChange={(e) => updateConfig('scanToken', e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                      />
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=Mirror%20Commits%20Scanner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center px-3 py-2 text-sm text-amber-700 hover:text-amber-900 border border-amber-300 bg-white rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        Crear
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          {stepBadge('02', step02Complete, step02Current)}
          <div>
            <h3 className={`text-lg font-semibold ${step02Complete ? 'text-green-800' : 'text-slate-900'}`}>
              Destino
              {step02Current && <span className="ml-2 text-sm font-normal text-slate-500">— Paso actual</span>}
            </h3>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Usuario de GitHub <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={(e) => updateConfig('githubUsername', e.target.value)}
              placeholder="tu-usuario"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-slate-700 mb-2">
              Nombre del repo mirror <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              value={config.mirrorName}
              onChange={(e) => updateConfig('mirrorName', e.target.value)}
              placeholder="work-mirror-2025"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">~</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-semibold text-slate-900">Opciones</h3>
            <span className="text-sm text-slate-400">opcional</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 text-base cursor-pointer group">
            <input
              type="checkbox"
              checked={config.autoPush}
              onChange={(e) => updateConfig('autoPush', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
            />
            <div>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Auto-push a GitHub</span>
              <span className="text-slate-400 block text-sm">Sube automáticamente el repo mirror</span>
            </div>
          </label>

          {config.autoPush && (
            <div className="ml-8 pl-5 border-l border-slate-200 space-y-4">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">
                  Token de GitHub
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Mirror%20Commits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-slate-400 hover:text-slate-600 text-sm font-normal"
                  >
                    crear uno &rarr;
                  </a>
                </label>
                <input
                  type="password"
                  value={config.githubToken}
                  onChange={(e) => updateConfig('githubToken', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
                />
              </div>

              <label className="flex items-center gap-3 text-base text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.private}
                  onChange={(e) => updateConfig('private', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
                />
                Hacer repositorio privado
              </label>
            </div>
          )}

          <label className="flex items-start gap-3 text-base cursor-pointer group">
            <input
              type="checkbox"
              checked={config.dryRun}
              onChange={(e) => updateConfig('dryRun', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
            />
            <div>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Modo prueba (dry-run)</span>
              <span className="text-slate-400 block text-sm">Solo muestra lo que haría, sin hacer cambios</span>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
