import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

export const metadata = {
  title: 'TimeCapsule Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
