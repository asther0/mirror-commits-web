'use client';

import { useState } from 'react';

function formatCommitDateRange(earliest, latest) {
  if (!earliest && !latest) return null;
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  if (earliest && latest && earliest.slice(0, 10) === latest.slice(0, 10)) {
    return fmt(latest);
  }
  if (earliest && latest) return `${fmt(earliest)} – ${fmt(latest)}`;
  return latest ? fmt(latest) : earliest ? fmt(earliest) : null;
}

export default function RepoScanner({ repos, selectedEmails, onEmailsChange, scanToken, onTokenRequired }) {
  const [scanning, setScanning] = useState(false);
  const [emailStats, setEmailStats] = useState([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [hasPrivateRepos, setHasPrivateRepos] = useState(false);

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
    setHasPrivateRepos(false);

    const emailMap = new Map();
    let foundPrivateRepo = false;

    try {
      for (const repoUrl of repos) {
        const repoInfo = extractRepoInfo(repoUrl);
        if (!repoInfo) continue;

        try {
          let page = 1;
          const maxPages = 10;
          let hasMore = true;

          while (hasMore && page <= maxPages) {
            const headers = {};
            if (scanToken) {
              headers['Authorization'] = `Bearer ${scanToken}`;
            }

            const response = await fetch(
              `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=100&page=${page}`,
              { headers }
            );

            if (!response.ok) {
              if ((response.status === 401 || response.status === 404) && !scanToken) {
                foundPrivateRepo = true;
              }
              break;
            }

            const commits = await response.json();
            if (commits.length === 0) break;

            commits.forEach((commit) => {
              const email = commit.commit?.author?.email;
              const dateStr = commit.commit?.author?.date;
              if (email) {
                if (!emailMap.has(email)) {
                  emailMap.set(email, { count: 0, repos: new Set(), earliestDate: null, latestDate: null });
                }
                const stats = emailMap.get(email);
                stats.count++;
                stats.repos.add(`${repoInfo.owner}/${repoInfo.repo}`);
                if (dateStr) {
                  if (!stats.earliestDate || dateStr < stats.earliestDate) stats.earliestDate = dateStr;
                  if (!stats.latestDate || dateStr > stats.latestDate) stats.latestDate = dateStr;
                }
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
        earliestDate: stats.earliestDate || null,
        latestDate: stats.latestDate || null,
      }));

      emailList.sort((a, b) => b.count - a.count);
      setEmailStats(emailList);

      if (foundPrivateRepo && onTokenRequired) {
        setHasPrivateRepos(true);
        onTokenRequired();
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
      const next = selectedEmails.filter(e => e !== email);
      onEmailsChange(next);
      if (next.length === 0) setExpanded(true);
    } else {
      onEmailsChange([...selectedEmails, email]);
    }
  };

  const selectAll = () => {
    onEmailsChange(emailStats.map(e => e.email));
    setExpanded(false);
  };

  const deselectAll = () => {
    onEmailsChange([]);
    setExpanded(true);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={scanRepositories}
        disabled={scanning || !repos || repos.length === 0}
        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-all border ${
          scanning
            ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-wait'
            : !repos || repos.length === 0
            ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
            : emailStats.length > 0
            ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:border-slate-800'
        }`}
      >
        {scanning ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Escaneando...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {emailStats.length > 0 ? 'Volver a escanear' : 'Escanear emails en repos'}
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {emailStats.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-base font-medium text-slate-700">
              {selectedEmails.length > 0
                ? `${selectedEmails.length} de ${emailStats.length} seleccionados`
                : `${emailStats.length} emails encontrados`
              }
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {!expanded && selectedEmails.length > 0 && (
            <div className="px-5 pb-3.5 flex flex-wrap gap-2">
              {selectedEmails.map((email) => (
                <span key={email} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono bg-slate-100 text-slate-600">
                  {email}
                </span>
              ))}
            </div>
          )}

          {expanded && (
            <div className="border-t border-slate-100">
              <div className="flex gap-3 justify-end px-5 py-2.5 bg-slate-50">
                <button onClick={selectAll} className="text-sm text-slate-500 hover:text-slate-700">
                  Todos
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={deselectAll} className="text-sm text-slate-500 hover:text-slate-700">
                  Ninguno
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {emailStats.map((stat) => {
                  const isSelected = selectedEmails.includes(stat.email);
                  const dateRangeStr = formatCommitDateRange(stat.earliestDate, stat.latestDate);

                  return (
                    <label
                      key={stat.email}
                      className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleEmail(stat.email)}
                        className="w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-400 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-base font-mono text-slate-800 break-all">{stat.email}</span>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-sm text-slate-500">
                          <span className="tabular-nums">
                            {stat.count} {stat.count === 1 ? 'commit' : 'commits'}
                          </span>
                          {dateRangeStr && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span>{dateRangeStr}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
