"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketingPanel } from "@/components/panels/MarketingPanel";
import { DeveloperPanel } from "@/components/panels/DeveloperPanel";
import { ClientPanel } from "@/components/panels/ClientPanel";
import { DataRequestPanel } from "@/components/panels/DataRequestPanel";
import { Megaphone, Code, Users, DatabaseZap } from "lucide-react";

export function DashboardLayout() {
  return (
    <div className="container mx-auto px-0 md:px-4 py-6">
      <Tabs defaultValue="marketing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="marketing" className="text-xs sm:text-sm">
            <Megaphone className="mr-1 sm:mr-2 h-4 w-4" /> Marketing
          </TabsTrigger>
          <TabsTrigger value="developer" className="text-xs sm:text-sm">
            <Code className="mr-1 sm:mr-2 h-4 w-4" /> Developer
          </TabsTrigger>
          <TabsTrigger value="clients" className="text-xs sm:text-sm">
            <Users className="mr-1 sm:mr-2 h-4 w-4" /> Clients
          </TabsTrigger>
          <TabsTrigger value="data-request" className="text-xs sm:text-sm">
            <DatabaseZap className="mr-1 sm:mr-2 h-4 w-4" /> Data Request
          </TabsTrigger>
        </TabsList>
        <TabsContent value="marketing">
          <MarketingPanel />
        </TabsContent>
        <TabsContent value="developer">
          <DeveloperPanel />
        </TabsContent>
        <TabsContent value="clients">
          <ClientPanel />
        </TabsContent>
        <TabsContent value="data-request">
          <DataRequestPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
