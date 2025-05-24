"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientCard } from "@/components/ClientCard";
import { ClientFormDialog } from "@/components/ClientFormDialog";
import type { Client } from "@/types";
import { ClientFormData } from "@/lib/schemas";
import { mockClients } from "@/lib/constants";
import { PlusCircle, Search, Users } from "lucide-react";

export function ClientPanel() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  
  // For this demo, clients are loaded from mock data. 
  // In a real app, this would be an API call.
  // useEffect(() => {
  //   setClients(mockClients);
  // }, []);

  const handleSaveClient = (data: ClientFormData, id?: string) => {
    if (id) {
      // Edit existing client
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === id ? { ...client, ...data } : client
        )
      );
    } else {
      // Create new client
      const newClient: Client = {
        id: `client-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setClients(prevClients => [newClient, ...prevClients]);
    }
  };

  const handleDeleteClient = (id: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== id));
  };

  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">Client Management</h2>
        <ClientFormDialog onSave={handleSaveClient} mode="create" />
      </div>
      
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search clients..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client}
              onUpdateClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Clients Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or add new clients.
          </p>
        </div>
      )}
    </div>
  );
}
