'use client';

import { MarketingPanel } from "@/components/panels/MarketingPanel";
import { Megaphone } from "lucide-react";

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Megaphone className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Marketing Dashboard</h1>
      </div>
      <MarketingPanel />
    </div>
  );
}
