'use client';

import { useState } from 'react';

/**
 * Component that detects emails used in a GitHub repository
 * Helps users find the correct email to use in the mirror tool
 */
export default function EmailDetector({ onEmailsFound }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const extractRepoInfo = (url) => {
    // Extract owner and repo from GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace('.git', '') };
  };

  const detectEmails = async () => {
    setLoading(true);
    setError('');
    setEmails([]);

    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      setError('URL de GitHub no válida');
      setLoading(false);
      return;
    }

    try {
      // Use GitHub API to get commits
      const response = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=100`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Repositorio no encontrado o es privado');
        } else {
          setError('Error al obtener commits del repositorio');
        }
        setLoading(false);
        return;
      }

      const commits = await response.json();

      // Extract unique emails
      const emailSet = new Set();
      commits.forEach((commit) => {
        if (commit.commit?.author?.email) {
          emailSet.add(commit.commit.author.email);
        }
      });

      const uniqueEmails = Array.from(emailSet);

      if (uniqueEmails.length === 0) {
        setError('No se encontraron emails en los commits');
      } else {
        setEmails(uniqueEmails);
      }
    } catch (err) {
      setError('Error al conectar con GitHub API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      detectEmails();
    }
  };

  const addEmail = (email) => {
    if (onEmailsFound) {
      onEmailsFound(email);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-900">
              ¿No sabes qué email usar?
            </h3>
            <p className="text-xs text-slate-500">
              Detecta automáticamente los emails de un repo
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content - Expandable */}
      {expanded && (
        <div className="px-5 sm:px-6 pb-5 border-t border-slate-200 pt-4 animate-fade-in">
          <div className="space-y-4">
            {/* Input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                URL del repositorio de GitHub
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://github.com/usuario/repo"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={detectEmails}
                  disabled={loading || !repoUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Detectar'
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {emails.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">
                    Emails encontrados ({emails.length})
                  </p>
                  {onEmailsFound && (
                    <button
                      onClick={() => {
                        emails.forEach(email => addEmail(email));
                        setExpanded(false);
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Agregar todos
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-slate-700 truncate">
                          {email}
                        </p>
                        {email.includes('users.noreply.github.com') && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Email privado de GitHub
                          </p>
                        )}
                      </div>
                      {onEmailsFound && (
                        <button
                          onClick={() => {
                            addEmail(email);
                            setExpanded(false);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shrink-0"
                        >
                          Usar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
