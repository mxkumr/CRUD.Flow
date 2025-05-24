
'use client';

import { ClientPanel } from "@/components/panels/ClientPanel";
import { DataRequestPanel } from "@/components/panels/DataRequestPanel";
import { PendingRequestsPanel } from "@/components/admin/PendingRequestsPanel"; // New import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DatabaseZap, UserCheck } from "lucide-react"; // Added UserCheck

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6"> 
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" /> Clients
          </TabsTrigger>
          <TabsTrigger value="data-request">
            <DatabaseZap className="mr-2 h-4 w-4" /> Data Request
          </TabsTrigger>
          <TabsTrigger value="pending-requests">
            <UserCheck className="mr-2 h-4 w-4" /> Sign-up Requests
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
      </Tabs>
    </div>
  );
}
