"use client";

import { useState } from "react";

interface PayloadPreviewProps {
  payload: any;
  maxHeight?: string;
}

export function PayloadPreview({ payload, maxHeight = "300px" }: PayloadPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group border border-white/10 rounded bg-black overflow-hidden">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <pre 
        className="p-4 text-xs font-mono text-zinc-300 overflow-auto"
        style={{ maxHeight: expanded ? "none" : maxHeight }}
      >
        {jsonString}
      </pre>
    </div>
  );
}
