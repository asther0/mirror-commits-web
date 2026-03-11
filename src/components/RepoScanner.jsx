'use client';

import { useState } from 'react';

/**
 * Component that scans repositories and detects all emails with commit counts
 * New UX flow: repos first, then auto-detect emails
 */
export default function RepoScanner({ repos, selectedEmails, onEmailsChange }) {
  const [scanning, setScanning] = useState(false);
  const [emailStats, setEmailStats] = useState([]);
  const [error, setError] = useState('');

  const extractRepoInfo = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace('.git', '') };
  };

  const scanRepositories = async () => {
    if (!repos || repos.length === 0) {
      setError('Agrega al menos un repositorio primero');
      return;
    }

    setScanning(true);
    setError('');
    setEmailStats([]);

    const emailMap = new Map(); // email -> { count, repos: [] }

    try {
      for (const repoUrl of repos) {
        const repoInfo = extractRepoInfo(repoUrl);
        if (!repoInfo) continue;

        try {
          let page = 1;
          const maxPages = 10;
          let hasMore = true;

          while (hasMore && page <= maxPages) {
            const response = await fetch(
              `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=100&page=${page}`
            );

            if (!response.ok) break;

            const commits = await response.json();
            if (commits.length === 0) break;

            commits.forEach((commit) => {
              const email = commit.commit?.author?.email;
              if (email) {
                if (!emailMap.has(email)) {
                  emailMap.set(email, { count: 0, repos: new Set() });
                }
                const stats = emailMap.get(email);
                stats.count++;
                stats.repos.add(`${repoInfo.owner}/${repoInfo.repo}`);
              }
            });

            hasMore = commits.length === 100;
            page++;
          }
        } catch (err) {
          console.error(`Error scanning ${repoUrl}:`, err);
        }
      }

      const emailList = Array.from(emailMap.entries()).map(([email, stats]) => ({
        email,
        count: stats.count,
        repos: Array.from(stats.repos),
      }));

      // Sort by commit count descending
      emailList.sort((a, b) => b.count - a.count);

      setEmailStats(emailList);

      // Auto-select all emails by default
      if (emailList.length > 0 && selectedEmails.length === 0) {
        onEmailsChange(emailList.map(e => e.email));
      }
    } catch (err) {
      setError('Error al escanear repositorios');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const toggleEmail = (email) => {
    if (selectedEmails.includes(email)) {
      onEmailsChange(selectedEmails.filter(e => e !== email));
    } else {
      onEmailsChange([...selectedEmails, email]);
    }
  };

  const selectAll = () => {
    onEmailsChange(emailStats.map(e => e.email));
  };

  const deselectAll = () => {
    onEmailsChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Scan Button */}
      <button
        onClick={scanRepositories}
        disabled={scanning || !repos || repos.length === 0}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
          scanning
            ? 'bg-blue-500 text-white cursor-wait'
            : repos && repos.length > 0
            ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {scanning ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Escaneando repositorios...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {emailStats.length > 0 ? 'Volver a escanear' : 'Escanear emails en repos'}
          </>
        )}
      </button>

      {/* Error Message */}
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

      {/* Email Results */}
      {emailStats.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-semibold text-green-900">
                {emailStats.length} email{emailStats.length !== 1 ? 's' : ''} encontrado{emailStats.length !== 1 ? 's' : ''}
              </h4>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs font-medium text-green-700 hover:text-green-800"
              >
                Seleccionar todos
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={deselectAll}
                className="text-xs font-medium text-green-700 hover:text-green-800"
              >
                Ninguno
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {emailStats.map((stat) => {
              const isSelected = selectedEmails.includes(stat.email);
              const isNoreply = stat.email.includes('users.noreply.github.com');

              return (
                <label
                  key={stat.email}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-2 border-green-400 shadow-sm'
                      : 'bg-white/50 border border-green-200 hover:border-green-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleEmail(stat.email)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-slate-800 break-all">
                        {stat.email}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 shrink-0">
                        {stat.count} commit{stat.count !== 1 ? 's' : ''}
                      </span>
                      {isNoreply && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 shrink-0">
                          GitHub noreply
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      En: {stat.repos.join(', ')}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
