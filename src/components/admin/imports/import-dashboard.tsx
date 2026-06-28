"use client";

import { useState } from "react";
import { ImportBatchTable } from "./import-batch-table";
import { RawRecordTable } from "./raw-record-table";
import { ReviewQueueTable } from "./review-queue-table";

interface ImportDashboardProps {
  stats: any;
  batches: any[];
  rawRecords: any[];
  reviewItems: any[];
}

export function ImportDashboard({ stats, batches, rawRecords, reviewItems }: ImportDashboardProps) {
  const [activeTab, setActiveTab] = useState<"batches" | "records" | "queue">("batches");

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Internal Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-lg mb-8 flex items-center justify-center font-mono text-sm">
        <span className="mr-2">⚠️</span> INTERNAL TOOL — Authentication and roles will be added later. Read-only mode active.
      </div>

      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Import Review Dashboard</h1>
        <p className="text-zinc-400">Monitor automated external integrations and resolve conflicts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-zinc-400 text-xs uppercase mb-1">Total Entities</div>
          <div className="text-2xl font-bold text-white">{stats.totalEntities}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-zinc-400 text-xs uppercase mb-1">Relations</div>
          <div className="text-2xl font-bold text-white">{stats.totalRelations}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-zinc-400 text-xs uppercase mb-1">Sources</div>
          <div className="text-2xl font-bold text-white">{stats.totalSources}</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="text-amber-400 text-xs uppercase mb-1">Pending Reviews</div>
          <div className="text-2xl font-bold text-amber-500">{stats.pendingReviews}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="text-red-400 text-xs uppercase mb-1">Failed Imports</div>
          <div className="text-2xl font-bold text-red-500">{stats.failedImports}</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="text-emerald-400 text-xs uppercase mb-1">Last Success</div>
          <div className="text-sm font-mono mt-2 text-emerald-300">
            {stats.lastSuccessfulImportDate ? new Date(stats.lastSuccessfulImportDate).toLocaleDateString() : "Never"}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab("batches")}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "batches" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Import Batches
        </button>
        <button
          onClick={() => setActiveTab("records")}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "records" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Raw Records
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "queue" ? "border-amber-400 text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Review Queue
          {stats.pendingReviews > 0 && (
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
              {stats.pendingReviews}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === "batches" && <ImportBatchTable batches={batches} />}
        {activeTab === "records" && <RawRecordTable records={rawRecords} />}
        {activeTab === "queue" && <ReviewQueueTable items={reviewItems} />}
      </div>
    </div>
  );
}
