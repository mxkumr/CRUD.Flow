
"use client";

import React, { useState, useEffect } from 'react';
import type { Campaign, CampaignLead } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, ListPlus, AlertCircle, Trash2 } from 'lucide-react';
import { generateCsv } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CampaignDataViewerProps {
  campaign: Campaign;
  onExport: (campaign: Campaign) => void;
  onDeleteLeads: (campaignId: string, leadIndices: number[]) => void;
  onCreateTasksFromLeads: (campaignId: string, leads: CampaignLead[]) => void; // Placeholder
}

export function CampaignDataViewer({ campaign, onExport, onDeleteLeads, onCreateTasksFromLeads }: CampaignDataViewerProps) {
  const [selectedLeadIndices, setSelectedLeadIndices] = useState<number[]>([]);
  const { toast } = useToast();

  // Reset selection when campaign changes
  useEffect(() => {
    setSelectedLeadIndices([]);
  }, [campaign.id]);

  const handleSelectLead = (index: number, checked: boolean) => {
    setSelectedLeadIndices(prev =>
      checked ? [...prev, index] : prev.filter(i => i !== index)
    );
  };

  const handleSelectAllLeads = (checked: boolean) => {
    setSelectedLeadIndices(checked ? campaign.data.map((_, index) => index) : []);
  };

  const handleDeleteSelectedLeads = () => {
    if (selectedLeadIndices.length === 0) {
      toast({ title: "No leads selected", description: "Please select leads to delete.", variant: "destructive" });
      return;
    }
    onDeleteLeads(campaign.id, selectedLeadIndices);
    setSelectedLeadIndices([]); // Clear selection after delete
  };

  const handleCreateTasks = () => {
    if (selectedLeadIndices.length === 0) {
      toast({ title: "No leads selected", description: "Please select leads to create tasks from.", variant: "destructive" });
      return;
    }
    const selectedLeads = selectedLeadIndices.map(index => campaign.data[index]);
    onCreateTasksFromLeads(campaign.id, selectedLeads);
    // Optionally clear selection after task creation
    // setSelectedLeadIndices([]); 
  };

  if (!campaign || !campaign.data) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg">No campaign data available.</p>
        <p>Please select or upload a campaign.</p>
      </div>
    );
  }

  const isAllSelected = campaign.data.length > 0 && selectedLeadIndices.length === campaign.data.length;
  const isAnySelected = selectedLeadIndices.length > 0;

  return (
    <div className="space-y-4 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h3 className="text-xl font-semibold text-foreground">Campaign: {campaign.name}</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => onExport(campaign)} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export All to CSV
          </Button>
          <Button onClick={handleCreateTasks} variant="outline" size="sm" disabled={!isAnySelected}>
            <ListPlus className="mr-2 h-4 w-4" /> Create Tasks ({selectedLeadIndices.length})
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={!isAnySelected}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedLeadIndices.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete {selectedLeadIndices.length} selected lead(s) from this campaign. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelectedLeads} className={buttonVariants({variant: "destructive"})}>
                  Yes, Delete Leads
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {campaign.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">This campaign has no leads.</p>
      ) : (
        <ScrollArea className="h-[400px] md:h-[500px] border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAllLeads(Boolean(checked))}
                    aria-label="Select all leads"
                  />
                </TableHead>
                {campaign.headers.map(header => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.data.map((row, rowIndex) => (
                <TableRow key={rowIndex} data-state={selectedLeadIndices.includes(rowIndex) ? "selected" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLeadIndices.includes(rowIndex)}
                      onCheckedChange={(checked) => handleSelectLead(rowIndex, Boolean(checked))}
                      aria-label={`Select lead ${rowIndex + 1}`}
                    />
                  </TableCell>
                  {campaign.headers.map(header => (
                    <TableCell key={`${rowIndex}-${header}`} className="max-w-[200px] truncate" title={row[header]}>
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
       <p className="text-xs text-muted-foreground">
        Displaying {campaign.data.length} leads. {selectedLeadIndices.length} selected.
      </p>
    </div>
  );
}

// Helper for AlertDialogAction styling if not directly using buttonVariants
const buttonVariants = ({variant}: {variant: "destructive" | "default" | "outline"}) => {
  if (variant === "destructive") return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  return "";
}
