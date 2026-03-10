'use client';

import { useState } from 'react';

export default function CommandPreview({ config }) {
  const [copied, setCopied] = useState(false);

  const generateCommand = () => {
    const parts = ['bash mirror.sh'];

    // Required params
    parts.push(`--emails "${config.emails}"`);
    parts.push(`--repos "${config.repos}"`);
    parts.push(`--name "${config.mirrorName}"`);

    // Optional params
    if (config.autoPush) {
      parts.push(`--username "${config.githubUsername}"`);
      parts.push(`--token "${config.githubToken}"`);
      parts.push('--auto-push');
    }

    if (config.private) {
      parts.push('--private');
    }

    if (config.dryRun) {
      parts.push('--dry-run');
    }

    return parts.join(' \\\n  ');
  };

  const command = generateCommand();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadScript = () => {
    // Download the actual script file
    const link = document.createElement('a');
    link.href = '/scripts/mirror.sh';
    link.download = 'mirror.sh';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Generated Command */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Script generado
          </h3>
          <button
            onClick={copyToClipboard}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              copied
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>

        <div className="p-4 overflow-x-auto bg-gray-900">
          <pre className="text-sm text-gray-100 font-mono leading-relaxed">
            <code>{command}</code>
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cómo ejecutar
        </h3>

        <ol className="space-y-4 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">Descarga el script</p>
              <button
                onClick={downloadScript}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
              >
                Descargar mirror.sh
              </button>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">Navega a la carpeta de proyectos</p>
              <code className="block bg-gray-100 border border-gray-200 px-3 py-2 rounded text-xs text-gray-800 font-mono">
                cd ~/Projects
              </code>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">Dale permisos de ejecución</p>
              <code className="block bg-gray-100 border border-gray-200 px-3 py-2 rounded text-xs text-gray-800 font-mono">
                chmod +x mirror.sh
              </code>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              4
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Ejecuta el comando generado arriba</p>
              <p className="text-xs text-gray-500 mt-1">
                Copia y pega el comando en tu terminal
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">
          Nota de seguridad
        </h4>
        <ul className="space-y-1 text-xs text-amber-800">
          <li>• Todo se procesa localmente en tu terminal</li>
          <li>• No se envía ningún dato a servidores externos</li>
          <li>• No se expone código, mensajes ni nombres de archivos</li>
          <li>• Solo se usan las fechas de los commits</li>
        </ul>
      </div>
    </div>
  );
}
