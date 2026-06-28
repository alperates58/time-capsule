import { PayloadPreview } from "./payload-preview";

interface ReviewQueueTableProps {
  items: any[];
}

function getPriorityColor(priority: number) {
  if (priority >= 80) return "text-red-400";
  if (priority >= 50) return "text-amber-400";
  return "text-emerald-400";
}

export function ReviewQueueTable({ items }: ReviewQueueTableProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center border border-white/10 rounded-lg bg-white/5">
        <p className="text-zinc-400">Queue is empty. No conflicts to resolve.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Future filtering placeholder */}
      <div className="flex gap-2 p-3 border border-white/10 bg-white/5 rounded-lg">
        <select disabled className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-zinc-400">
          <option>Status: PENDING</option>
        </select>
        <select disabled className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-zinc-400">
          <option>Type: All</option>
        </select>
        <select disabled className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-zinc-400">
          <option>Priority: All</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-lg bg-black/50">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-white/5 text-xs uppercase text-zinc-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Conflict Details</th>
              <th className="px-4 py-3">Priority / Confidence</th>
              <th className="px-4 py-3">Payload Data</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-white mb-1">{item.type}</div>
                  <div className="text-zinc-400 text-xs mb-2">{item.reason}</div>
                  {item.proposedAction && (
                    <div className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded inline-block border border-emerald-400/20">
                      Proposed: {item.proposedAction}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className={`font-mono text-xs ${getPriorityColor(item.priority)}`}>P{item.priority}</div>
                  <div className="font-mono text-xs text-zinc-500 mt-1">C{item.confidence}</div>
                </td>
                <td className="px-4 py-3 align-top max-w-md">
                  <PayloadPreview payload={item.payload} maxHeight="150px" />
                </td>
                <td className="px-4 py-3 align-top text-right space-x-2">
                  <button disabled className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 cursor-not-allowed">
                    Approve
                  </button>
                  <button disabled className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded border border-red-500/30 cursor-not-allowed">
                    Reject
                  </button>
                  <button disabled className="px-3 py-1 text-xs bg-white/5 text-zinc-400 rounded border border-white/10 cursor-not-allowed block mt-2 w-full text-center">
                    Open Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
