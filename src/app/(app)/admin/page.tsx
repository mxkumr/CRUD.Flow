
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6"> 
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" /> Clients
          </TabsTrigger>
          <TabsTrigger value="data-request">
            <DatabaseZap className="mr-2 h-4 w-4" /> Data Request
          </TabsTrigger>
          <TabsTrigger value="pending-requests">
            <UserCheck className="mr-2 h-4 w-4" /> Sign-up Requests
          </TabsTrigger>
          <TabsTrigger value="developer-tasks">
            <Code className="mr-2 h-4 w-4" /> Developer Tasks
          </TabsTrigger>
          <TabsTrigger value="marketing-tasks">
            <Megaphone className="mr-2 h-4 w-4" /> Marketing Tasks
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

