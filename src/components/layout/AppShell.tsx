import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-surface">
    <Header />
    <div className="flex-1 flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
    <Footer />
  </div>
);