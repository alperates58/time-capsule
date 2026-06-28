import { PayloadPreview } from "./payload-preview";

interface RawRecordTableProps {
  records: any[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "PROCESSED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "SKIPPED": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "FAILED": return "text-red-400 bg-red-400/10 border-red-400/20";
    default: return "text-zinc-400 bg-white/5 border-white/10";
  }
}

export function RawRecordTable({ records }: RawRecordTableProps) {
  if (records.length === 0) {
    return (
      <div className="p-8 text-center border border-white/10 rounded-lg bg-white/5">
        <p className="text-zinc-400">No raw records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10 rounded-lg bg-black/50">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="bg-white/5 text-xs uppercase text-zinc-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3">ID / Source</th>
            <th className="px-4 py-3">External ID</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payload</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-white/5">
              <td className="px-4 py-3 align-top">
                <div className="font-mono text-xs text-zinc-500 mb-1">{record.id}</div>
                <div>{record.source?.name}</div>
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs">
                {record.externalId || "-"}
              </td>
              <td className="px-4 py-3 align-top">
                <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </td>
              <td className="px-4 py-3 align-top max-w-md">
                <PayloadPreview payload={record.rawPayload} maxHeight="150px" />
              </td>
              <td className="px-4 py-3 align-top">
                <button disabled className="px-3 py-1 text-xs bg-white/5 text-zinc-500 rounded border border-white/10 cursor-not-allowed">
                  View Raw
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
