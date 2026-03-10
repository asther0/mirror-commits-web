'use client';

export default function CommandBuilder({ config, updateConfig }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Pasos para usar
      </h2>

      <div className="space-y-6">
        {/* Step 1 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">
              1
            </span>
            <h3 className="font-medium text-gray-900">Configura tus datos</h3>
          </div>

          <div className="ml-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Emails de trabajo (separados por coma)
              </label>
              <input
                type="text"
                value={config.emails}
                onChange={(e) => updateConfig('emails', e.target.value)}
                placeholder="trabajo@empresa.com,personal@gmail.com"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombres de repositorios (separados por coma)
              </label>
              <input
                type="text"
                value={config.repos}
                onChange={(e) => updateConfig('repos', e.target.value)}
                placeholder="proyecto-uno,proyecto-dos"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Deben ser carpetas en tu directorio actual
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del repositorio mirror
              </label>
              <input
                type="text"
                value={config.mirrorName}
                onChange={(e) => updateConfig('mirrorName', e.target.value)}
                placeholder="work-mirror-2025"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold">
              2
            </span>
            <h3 className="font-medium text-gray-900">Opciones adicionales</h3>
          </div>

          <div className="ml-8 space-y-4">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={config.autoPush}
                onChange={(e) => updateConfig('autoPush', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium">Auto-push a GitHub</span>
                <span className="text-gray-500 block text-xs">Requiere token de GitHub</span>
              </div>
            </label>

            {config.autoPush && (
              <div className="space-y-3 ml-6 pl-4 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Usuario de GitHub
                  </label>
                  <input
                    type="text"
                    value={config.githubUsername}
                    onChange={(e) => updateConfig('githubUsername', e.target.value)}
                    placeholder="tu-usuario"
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Token de GitHub
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Mirror%20Commits"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline text-xs font-normal"
                    >
                      (crear uno)
                    </a>
                  </label>
                  <input
                    type="password"
                    value={config.githubToken}
                    onChange={(e) => updateConfig('githubToken', e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-amber-600">
                    No se envía a ningún servidor - solo se usa en tu terminal
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={config.private}
                    onChange={(e) => updateConfig('private', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Hacer repositorio privado
                </label>
              </div>
            )}

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={config.dryRun}
                onChange={(e) => updateConfig('dryRun', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium">Modo prueba</span>
                <span className="text-gray-500 block text-xs">Solo vista previa, sin cambios</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
