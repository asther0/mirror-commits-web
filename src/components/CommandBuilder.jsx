'use client';

import TagInput from '@/components/TagInput';
import RepoScanner from '@/components/RepoScanner';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      {/* PASO 1: REPOSITORIOS + AUTO-SCAN */}
      <section>
        <StepHeader number={1} title="Agrega tus repos" subtitle="Luego escanearemos los emails" />

        <div className="space-y-5 mt-4">
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

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-slate-700">
                Emails de tus commits
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Escanea tus repos para detectarlos automáticamente
              </p>
            </div>
            <RepoScanner
              repos={config.repos}
              selectedEmails={config.emails || []}
              onEmailsChange={(newEmails) => updateConfig('emails', newEmails)}
            />
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* PASO 2: DESTINO */}
      <section>
        <StepHeader number={2} title="Destino del mirror" subtitle="Donde se creará tu repositorio" />

        <div className="space-y-4 mt-4">
          <div>
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
          </div>

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
      </section>

      {/* OPCIONES - sin número de paso, es opcional */}
      <div className="border border-dashed border-slate-200 rounded-lg p-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Opcional</p>

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
              <span className="text-slate-400 block text-xs">Sube automáticamente el repo mirror</span>
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

function StepHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
        {number}
      </span>
      <div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
