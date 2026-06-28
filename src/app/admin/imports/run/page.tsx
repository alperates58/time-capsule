"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ImportRunner() {
  const [mode, setMode] = useState<'single' | 'range'>('single');
  const [year, setYear] = useState<number>(1998);
  const [from, setFrom] = useState<number>(1998);
  const [to, setTo] = useState<number>(2000);
  const [provider, setProvider] = useState<string>('wikidata');
  const [types, setTypes] = useState<string[]>(['events', 'films', 'births', 'deaths']);
  const [limit, setLimit] = useState<number>(10);
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [delayMs, setDelayMs] = useState<number>(1000);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeToggle = (type: string) => {
    setTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dryRun) {
      if (!window.confirm("WARNING: dryRun is disabled. This will MUTATE the database. Are you sure?")) {
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/imports/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          year: Number(year),
          from: Number(from),
          to: Number(to),
          provider,
          types,
          limit: Number(limit),
          dryRun,
          delayMs: Number(delayMs)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run import');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/imports" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Run Import</h1>
          <p className="text-neutral-400 mt-1">Execute bulk data orchestration natively.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Configuration</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Mode</label>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                >
                  <option value="single">Single Year</option>
                  <option value="range">Year Range (Max 10)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Provider</label>
                <select 
                  value={provider} 
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                >
                  <option value="wikidata">Wikidata (Active)</option>
                  <option value="tmdb" disabled>TMDB (Coming Soon)</option>
                </select>
              </div>
            </div>

            {mode === 'single' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Target Year</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">From Year</label>
                  <input type="number" value={from} onChange={e => setFrom(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">To Year</label>
                  <input type="number" value={to} onChange={e => setTo(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Entity Types</label>
              <div className="flex gap-4">
                {['events', 'films', 'births', 'deaths'].map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                    <input type="checkbox" checked={types.includes(t)} onChange={() => handleTypeToggle(t)} className="rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500/50" />
                    <span className="capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Limit per Request (Max 50)</label>
                <input type="number" max={50} min={1} value={limit} onChange={e => setLimit(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Delay (ms)</label>
                <input type="number" value={delayMs} onChange={e => setDelayMs(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 transition-colors hover:bg-neutral-800/50">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-white">Dry Run Mode</span>
                  <p className="text-xs text-neutral-400">If active, no data will be written to the database.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={dryRun} 
                  onChange={(e) => setDryRun(e.target.checked)} 
                  className="w-5 h-5 rounded border-neutral-700 text-indigo-500 focus:ring-indigo-500/50 bg-neutral-900" 
                />
              </label>
            </div>
            
            {!dryRun && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">Warning: Dry Run is disabled. The database will be mutated and live data will be modified.</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || types.length === 0}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <span className="animate-pulse">Orchestrating...</span> : <><Play className="w-4 h-4" /> Run Import Job</>}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-red-400 font-medium mb-2">
                <XCircle className="w-5 h-5" /> Error
              </h3>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-green-400 font-medium text-lg">
                <CheckCircle className="w-5 h-5" /> Import Complete
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Processed</div>
                  <div className="text-xl font-bold text-white">{result.stats.processed}</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Success</div>
                  <div className="text-xl font-bold text-green-400">{result.stats.success}</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Imported Entities</div>
                  <div className="text-xl font-bold text-indigo-400">{result.stats.totalImported}</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Errors</div>
                  <div className="text-xl font-bold text-red-400">{result.stats.totalErrors}</div>
                </div>
              </div>

              {result.stats.details && result.stats.details.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">Log Output</div>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 max-h-48 overflow-y-auto text-xs font-mono text-neutral-300 space-y-1">
                    {result.stats.details.map((d: string, i: number) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center text-neutral-400 text-sm">
              Ready to execute import. Results will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
