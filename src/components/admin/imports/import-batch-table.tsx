interface ImportBatchTableProps {
  batches: any[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "PARTIAL": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "FAILED": return "text-red-400 bg-red-400/10 border-red-400/20";
    case "RUNNING": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "PENDING": return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    default: return "text-zinc-400 bg-white/5 border-white/10";
  }
}

function formatDuration(start: Date, end?: Date) {
  if (!end) return "-";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ImportBatchTable({ batches }: ImportBatchTableProps) {
  if (batches.length === 0) {
    return (
      <div className="p-8 text-center border border-white/10 rounded-lg bg-white/5">
        <p className="text-zinc-400">No imports found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10 rounded-lg bg-black/50">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="bg-white/5 text-xs uppercase text-zinc-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Timeline</th>
            <th className="px-4 py-3">Stats</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <div className="font-semibold text-white">{batch.source?.name}</div>
                <div className="text-xs text-zinc-500 font-mono mt-1">{batch.id.substring(0,8)}...</div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(batch.status)}`}>
                  {batch.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs space-y-1 text-zinc-400">
                  <div className="flex gap-2">
                    <span className="w-12 inline-block">Started:</span>
                    <span className="text-zinc-300">{new Date(batch.startedAt).toLocaleString()}</span>
                  </div>
                  {batch.finishedAt && (
                    <div className="flex gap-2">
                      <span className="w-12 inline-block">Finished:</span>
                      <span className="text-zinc-300">{new Date(batch.finishedAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-zinc-500 font-mono mt-1">
                    <span className="w-12 inline-block">Duration:</span>
                    <span>{formatDuration(batch.startedAt, batch.finishedAt)}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">
                {batch.stats ? (
                  <div className="space-y-1 text-zinc-400">
                    <div>Entities: <span className="text-white">{(batch.stats as any).importedEntities || 0}</span></div>
                    <div>Relations: <span className="text-white">{(batch.stats as any).importedRelations || 0}</span></div>
                    <div>Errors: <span className="text-red-400">{(batch.errorLog as any[])?.length || 0}</span></div>
                  </div>
                ) : (
                  <span className="text-zinc-500">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button disabled className="px-3 py-1 text-xs bg-white/5 text-zinc-500 rounded border border-white/10 cursor-not-allowed">
                  Export Logs
                </button>
                <button disabled className="px-3 py-1 text-xs bg-white/5 text-zinc-500 rounded border border-white/10 cursor-not-allowed">
                  Retry Import
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
