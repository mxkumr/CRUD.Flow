"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ClientFormDialog } from "@/components/ClientFormDialog";
import type { Client } from "@/types";
import { ClientFormData } from "@/lib/schemas";
import { Edit, Mail, MoreVertical, Phone, Trash2, Briefcase, UserCircle } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface ClientCardProps {
  client: Client;
  onUpdateClient: (data: ClientFormData, id: string) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientCard({ client, onUpdateClient, onDeleteClient }: ClientCardProps) {
  return (
    <Card className="w-full shadow-lg bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center">
             <UserCircle className="mr-2 h-6 w-6 text-primary" />
            {client.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <ClientFormDialog 
                client={client} 
                onSave={onUpdateClient}
                mode="edit"
                triggerButton={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                 <Edit className="mr-2 h-4 w-4" /> Edit Client
                               </DropdownMenuItem>}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClient(client.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Contact: {client.contactPerson}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 space-y-2 text-sm">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-primary" />
          <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-primary" />
          <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
        </div>
        {client.projects.length > 0 && (
          <div className="flex items-start pt-1">
            <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <div>
              <span className="font-medium">Projects:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.projects.map((project, index) => (
                  <Badge key={index} variant="secondary">{project}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          Client since: {format(parseISO(client.createdAt), "MMM dd, yyyy")}
        </p>
      </CardFooter>
    </Card>
  );
}
