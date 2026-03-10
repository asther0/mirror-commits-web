'use client';

import TagInput from '@/components/TagInput';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      {/* PASO 1: ORIGEN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold shrink-0">
            1
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">De dónde vienen tus commits</h3>
            <p className="text-xs text-slate-400">Agrega los emails y repos de trabajo que quieres reflejar</p>
          </div>
        </div>

        <div className="space-y-5">
          <TagInput
            label="Emails de trabajo"
            value={config.emails}
            onChange={(newEmails) => updateConfig('emails', newEmails)}
            placeholder="trabajo@empresa.com"
            type="email"
            helpText="Los emails con los que haces commits en el trabajo"
          />

          <TagInput
            label="Repositorios"
            value={config.repos}
            onChange={(newRepos) => updateConfig('repos', newRepos)}
            placeholder="https://github.com/usuario/repo"
            type="url"
            helpText="URLs completas de los repos de GitHub"
          />
        </div>
      </div>

      {/* PASO 2: DESTINO */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold shrink-0">
            2
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">Dónde se reflejarán</h3>
            <p className="text-xs text-slate-400">Tu usuario y el nombre del repo mirror en GitHub</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Usuario de GitHub
            </label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={(e) => updateConfig('githubUsername', e.target.value)}
              placeholder="tu-usuario"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del repo mirror
            </label>
            <input
              type="text"
              value={config.mirrorName}
              onChange={(e) => updateConfig('mirrorName', e.target.value)}
              placeholder="work-mirror-2025"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <p className="mt-1 text-xs text-slate-400">
              Se creará si no existe
            </p>
          </div>
        </div>
      </div>

      {/* PASO 3: OPCIONES */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-sm font-bold shrink-0">
            3
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">Opciones extras</h3>
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
                <p className="mt-1 text-xs text-amber-600">
                  No se envía a ningún servidor - solo se usa en tu terminal
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
