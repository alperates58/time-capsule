import { Metadata } from "next";
import { ImportDashboard } from "@/components/admin/imports/import-dashboard";
import {
  getImportDashboardStats,
  getRecentImportBatches,
  getRecentRawRecords,
  getPendingReviewQueueItems
} from "@/lib/admin/import-dashboard";

export const metadata: Metadata = {
  title: "Import Dashboard | Admin",
  robots: { index: false, follow: false },
};

// Next.js config to force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";

export default async function AdminImportsPage() {
  const [stats, batches, rawRecords, reviewItems] = await Promise.all([
    getImportDashboardStats(),
    getRecentImportBatches(10),
    getRecentRawRecords(20),
    getPendingReviewQueueItems(20)
  ]);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <ImportDashboard 
        stats={stats}
        batches={batches}
        rawRecords={rawRecords}
        reviewItems={reviewItems}
      />
    </main>
  );
}
