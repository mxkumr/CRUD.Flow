'use client';

import { DeveloperPanel } from "@/components/panels/DeveloperPanel";
import { Code } from "lucide-react";

export default function DeveloperDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-3">
        <Code className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
      </div>
      <DeveloperPanel />
    </div>
  );
}
