"use client";

import { Briefcase } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-6 border-b border-border">
      <div className="container mx-auto flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">AgencyFlow</h1>
      </div>
    </header>
  );
}
