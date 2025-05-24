
'use client';

import { ClientPanel } from "@/components/panels/ClientPanel";
import { DataRequestPanel } from "@/components/panels/DataRequestPanel";
import { PendingRequestsPanel } from "@/components/admin/PendingRequestsPanel";
import { DeveloperPanel } from "@/components/panels/DeveloperPanel"; // New import
import { MarketingPanel } from "@/components/panels/MarketingPanel"; // New import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DatabaseZap, UserCheck, Code, Megaphone } from "lucide-react"; // Added Code, Megaphone

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="flex items-center justify-start w-full overflow-x-auto h-12 rounded-md bg-muted p-1 text-muted-foreground mb-6"> 
          <TabsTrigger value="clients" className="px-3 py-1.5">
            <Users className="mr-2 h-4 w-4 flex-shrink-0" /> Clients
          </TabsTrigger>
          <TabsTrigger value="data-request" className="px-3 py-1.5">
            <DatabaseZap className="mr-2 h-4 w-4 flex-shrink-0" /> Data Request
          </TabsTrigger>
          <TabsTrigger value="pending-requests" className="px-3 py-1.5">
            <UserCheck className="mr-2 h-4 w-4 flex-shrink-0" /> Sign-up Requests
          </TabsTrigger>
          <TabsTrigger value="developer-tasks" className="px-3 py-1.5">
            <Code className="mr-2 h-4 w-4 flex-shrink-0" /> Developer Tasks
          </TabsTrigger>
          <TabsTrigger value="marketing-tasks" className="px-3 py-1.5">
            <Megaphone className="mr-2 h-4 w-4 flex-shrink-0" /> Marketing Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <ClientPanel />
        </TabsContent>
        <TabsContent value="data-request">
          <DataRequestPanel />
        </TabsContent>
        <TabsContent value="pending-requests">
          <PendingRequestsPanel />
        </TabsContent>
        <TabsContent value="developer-tasks">
          <DeveloperPanel />
        </TabsContent>
        <TabsContent value="marketing-tasks">
          <MarketingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
