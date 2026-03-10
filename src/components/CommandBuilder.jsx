'use client';

import TagInput from '@/components/TagInput';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      {/* ORIGEN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Origen</h3>
            <p className="text-xs text-slate-400">De dónde vienen tus commits</p>
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

      {/* DESTINO */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Destino</h3>
            <p className="text-xs text-slate-400">Donde se reflejarán los commits</p>
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

      {/* OPCIONES */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Opciones</h3>
            <p className="text-xs text-slate-400">Configuración adicional</p>
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
