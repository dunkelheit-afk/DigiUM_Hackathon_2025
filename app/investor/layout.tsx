// app/investor/layout.tsx
import { InvestorSidebar } from '@/components/Dashboard/sidebar_inves'; // Import InvestorSidebar
// Hapus import ini: import { SidebarToggleProvider } from '@/app/contexts/SidebarToggleContext';
import { UserProvider } from '@/app/contexts/UserContext';

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
        <div className="flex h-screen">
          <InvestorSidebar /> {/* Gunakan InvestorSidebar yang baru */}
          <main className="flex-1 overflow-y-auto p-4 bg-purple-50">
            {children}
          </main>
        </div>
      {/* </SidebarToggleProvider> */}
    </UserProvider>
  );
}