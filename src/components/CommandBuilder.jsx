'use client';

import TagInput from '@/components/TagInput';
import RepoScanner from '@/components/RepoScanner';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="space-y-10">
      {/* STEP 1 */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-xs font-mono text-slate-400">01</span>
          <h3 className="text-base font-semibold text-slate-900">Repositorios y emails</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Repositorios de trabajo <span className="text-slate-400">*</span>
            </label>
            <TagInput
              value={config.repos}
              onChange={(newRepos) => updateConfig('repos', newRepos)}
              placeholder="https://github.com/usuario/repo"
              type="url"
              helpText="URLs de GitHub (públicas o privadas con token)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Emails de tus commits <span className="text-slate-400">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Escanea tus repos para detectarlos automáticamente
            </p>
            <RepoScanner
              repos={config.repos}
              selectedEmails={config.emails || []}
              onEmailsChange={(newEmails) => updateConfig('emails', newEmails)}
            />
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-xs font-mono text-slate-400">02</span>
          <h3 className="text-base font-semibold text-slate-900">Destino</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Usuario de GitHub <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={(e) => updateConfig('githubUsername', e.target.value)}
              placeholder="tu-usuario"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del repo mirror <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              value={config.mirrorName}
              onChange={(e) => updateConfig('mirrorName', e.target.value)}
              placeholder="work-mirror-2025"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-xs font-mono text-slate-400">--</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-semibold text-slate-900">Opciones</h3>
            <span className="text-xs text-slate-400">opcional</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm cursor-pointer group">
            <input
              type="checkbox"
              checked={config.autoPush}
              onChange={(e) => updateConfig('autoPush', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
            />
            <div>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Auto-push a GitHub</span>
              <span className="text-slate-400 block text-xs">Sube automáticamente el repo mirror</span>
            </div>
          </label>

          {config.autoPush && (
            <div className="ml-7 pl-4 border-l border-slate-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Token de GitHub
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Mirror%20Commits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-slate-400 hover:text-slate-600 text-xs font-normal"
                  >
                    crear uno &rarr;
                  </a>
                </label>
                <input
                  type="password"
                  value={config.githubToken}
                  onChange={(e) => updateConfig('githubToken', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-colors"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.private}
                  onChange={(e) => updateConfig('private', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
                />
                Hacer repositorio privado
              </label>
            </div>
          )}

          <label className="flex items-start gap-3 text-sm cursor-pointer group">
            <input
              type="checkbox"
              checked={config.dryRun}
              onChange={(e) => updateConfig('dryRun', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
            />
            <div>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Modo prueba (dry-run)</span>
              <span className="text-slate-400 block text-xs">Solo muestra lo que haría, sin hacer cambios</span>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
