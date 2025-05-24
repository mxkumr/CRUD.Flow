import { AppHeader } from "@/components/AppHeader";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <AppHeader />
      <DashboardLayout />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} AgencyFlow. All rights reserved.
      </footer>
    </main>
  );
}
