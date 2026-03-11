'use client';

import TagInput from '@/components/TagInput';
import RepoScanner from '@/components/RepoScanner';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* PASO 1: REPOSITORIOS + AUTO-SCAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white text-xs sm:text-sm font-bold shrink-0">
            1
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Agrega tus repos</h3>
            <p className="text-xs text-slate-400">Luego escanearemos los emails automáticamente</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Repos Input */}
          <div>
            <div className="mb-1.5">
              <span className="text-sm font-medium text-slate-700">
                Repositorios de trabajo
                <span className="text-red-500 ml-1">*</span>
              </span>
            </div>
            <TagInput
              value={config.repos}
              onChange={(newRepos) => updateConfig('repos', newRepos)}
              placeholder="https://github.com/usuario/repo"
              type="url"
              helpText="URLs de GitHub (públicas o privadas con token)"
            />
          </div>

          {/* Auto Email Scanner - NEW FLOW */}
          <div className="border-t border-slate-200 pt-5">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                ¿Qué emails tienen tus commits?
              </h4>
              <p className="text-xs text-slate-500">
                Escanea tus repos para descubrir automáticamente los emails usados
              </p>
            </div>
            <RepoScanner
              repos={config.repos}
              selectedEmails={config.emails || []}
              onEmailsChange={(newEmails) => updateConfig('emails', newEmails)}
            />
          </div>

          {/* Username */}
          <div className="border-t border-slate-200 pt-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Usuario de GitHub
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={(e) => updateConfig('githubUsername', e.target.value)}
              placeholder="tu-usuario"
              className={`w-full bg-white border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 outline-none transition-colors ${
                !config.githubUsername || config.githubUsername.trim() === ''
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-primary focus:ring-primary'
              }`}
            />
            <p className="mt-1 text-xs text-slate-400">
              Donde se subirá el repo mirror
            </p>
          </div>

          {/* Mirror Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del repo mirror
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={config.mirrorName}
              onChange={(e) => updateConfig('mirrorName', e.target.value)}
              placeholder="work-mirror-2025"
              className={`w-full bg-white border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 outline-none transition-colors ${
                !config.mirrorName || config.mirrorName.trim() === ''
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-primary focus:ring-primary'
              }`}
            />
            <p className="mt-1 text-xs text-slate-400">
              Se creará si no existe
            </p>
          </div>
        </div>
      </div>

      {/* PASO 2: OPCIONES */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-600 text-xs sm:text-sm font-bold shrink-0">
            2
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Opciones extras</h3>
            <p className="text-xs text-slate-400">Opcional: auto-push, repo privado, modo prueba</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoPush}
              onChange={(e) => updateConfig('autoPush', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <div>
              <span className="font-medium text-slate-800">Auto-push a GitHub</span>
              <span className="text-slate-400 block text-xs">Sube automáticamente el repo mirror a GitHub</span>
            </div>
          </label>

          {config.autoPush && (
            <div className="space-y-3 ml-7 pl-4 border-l-2 border-primary/20">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Token de GitHub
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Mirror%20Commits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline text-xs font-normal"
                  >
                    (crear uno)
                  </a>
                </label>
                <input
                  type="password"
                  value={config.githubToken}
                  onChange={(e) => updateConfig('githubToken', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Se usa para clonar repos privados y subir el mirror automáticamente
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.private}
                  onChange={(e) => updateConfig('private', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                Hacer repositorio privado
              </label>
            </div>
          )}

          <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.dryRun}
              onChange={(e) => updateConfig('dryRun', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <div>
              <span className="font-medium text-slate-800">Modo prueba (dry-run)</span>
              <span className="text-slate-400 block text-xs">Solo muestra lo que haría, sin hacer cambios</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
