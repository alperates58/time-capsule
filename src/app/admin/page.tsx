export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-2">Welcome to the TimeCapsule Admin area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-400 text-sm font-medium">Pending Reviews</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-400 text-sm font-medium">Recent Imports</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-400 text-sm font-medium">System Health</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">Online</p>
        </div>
      </div>
    </div>
  );
}
