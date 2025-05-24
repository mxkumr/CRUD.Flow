
'use client';

import { useEffect, useState } from 'react';
import type { SystemUser } from '@/types';
import { ClientPanel } from "@/components/panels/ClientPanel";
import { PendingRequestsPanel } from "@/components/admin/PendingRequestsPanel";
import { DeveloperPanel } from "@/components/panels/DeveloperPanel";
import { MarketingPanel } from "@/components/panels/MarketingPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Code, Megaphone } from "lucide-react";

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';

export default function AdminDashboardPage() {
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  useEffect(() => {
    const updatePendingCount = () => {
      if (typeof window !== 'undefined') {
        const storedRequests: SystemUser[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
        const pendingCount = storedRequests.filter(req => req.status === 'pending').length;
        setPendingRequestCount(pendingCount);
      }
    };

    updatePendingCount();

    // Optional: Listen for storage changes if requests might be updated from another tab/window
    // This is a simplified version. Robust solutions might use BroadcastChannel or custom events.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SIGNUP_REQUESTS_STORAGE_KEY) {
        updatePendingCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="flex items-center justify-start w-full overflow-x-auto h-12 rounded-md bg-muted p-1 text-muted-foreground mb-6"> 
          <TabsTrigger value="clients" className="px-3 py-1.5">
            <Users className="mr-2 h-4 w-4 flex-shrink-0" /> Clients
          </TabsTrigger>
          <TabsTrigger value="pending-requests" className="px-3 py-1.5 flex items-center">
            <UserCheck className="mr-2 h-4 w-4 flex-shrink-0" /> Sign-up Requests
            {pendingRequestCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {pendingRequestCount}
              </Badge>
            )}
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
