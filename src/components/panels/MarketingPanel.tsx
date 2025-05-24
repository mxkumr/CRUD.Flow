
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { AIPrioritizationSection } from "@/components/AIPrioritizationSection";
import type { Task, TaskStatus, Campaign, CampaignLead, UserRole, SystemUser } from "@/types";
import { TaskFormData } from "@/lib/schemas";
import { mockTasks } from "@/lib/constants"; 
import { PlusCircle, Search, Filter, UploadCloud, ListChecks, Trash2, Users, Eye, FileSpreadsheet } from "lucide-react";
import { CampaignUploadDialog } from "@/components/marketing/CampaignUploadDialog";
import { CampaignDataViewer } from "@/components/marketing/CampaignDataViewer";
import { parseCsv, generateCsv } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
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
import { getAssignableUsers } from "@/types"; // For assigning campaigns

const MARKETING_TASKS_STORAGE_KEY = 'marketingTasks';
const MARKETING_CAMPAIGNS_STORAGE_KEY = 'marketingCampaigns';

export function MarketingPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  const [searchTermTasks, setSearchTermTasks] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [importanceFilter, setImportanceFilter] = useState<Task["importance"] | "all">("all");

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [marketers, setMarketers] = useState<SystemUser[]>([]);


  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as UserRole | null;
    const userId = localStorage.getItem('loggedInUserId'); // Assuming this is stored
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    const storedTasks = JSON.parse(localStorage.getItem(MARKETING_TASKS_STORAGE_KEY) || 'null');
    if (storedTasks) {
      setTasks(storedTasks);
    } else {
      const marketingTaskTypes: Task["type"][] = ['cold-call', 'email', 'content-creation', 'research', 'meeting'];
      const initialMarketingTasks = mockTasks.filter(task => marketingTaskTypes.includes(task.type));
      setTasks(initialMarketingTasks);
      localStorage.setItem(MARKETING_TASKS_STORAGE_KEY, JSON.stringify(initialMarketingTasks));
    }

    const storedCampaigns = JSON.parse(localStorage.getItem(MARKETING_CAMPAIGNS_STORAGE_KEY) || '[]');
    setCampaigns(storedCampaigns);
    
    if (role === 'admin') {
        const allMarketers = getAssignableUsers('marketer');
        setMarketers(allMarketers.filter(user => user.desiredRole === 'marketer'));
    }

  }, []);

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem(MARKETING_TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const saveCampaignsToLocalStorage = useCallback((updatedCampaigns: Campaign[]) => {
    localStorage.setItem(MARKETING_CAMPAIGNS_STORAGE_KEY, JSON.stringify(updatedCampaigns));
  }, []);


  const handleSaveTask = (data: TaskFormData, id?: string) => {
    let updatedTasks;
    if (id) {
      updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, ...data, type: data.type as TaskType } : task
      );
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...data,
        type: data.type as TaskType, // Ensure type is correctly cast
        createdAt: new Date().toISOString(),
      };
      updatedTasks = [newTask, ...tasks];
    }
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    const updatedTasks = tasks.map(task => (task.id === id ? { ...task, status } : task));
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };
  
  const handlePrioritizedTasks = (prioritizedTasks: Task[]) => {
    setTasks(prioritizedTasks);
    // Persist AI order if desired: saveTasksToLocalStorage(prioritizedTasks);
  };

  const handleFileUpload = (file: File, campaignName: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const { headers, data } = parseCsv(text);
        if (headers.length === 0 || data.length === 0) {
          toast({ title: "Empty or invalid CSV", description: "The CSV file seems to be empty or incorrectly formatted.", variant: "destructive" });
          return;
        }
        const newCampaign: Campaign = {
          id: `campaign-${Date.now()}`,
          name: campaignName,
          headers,
          data,
          uploadedByRole: currentUserRole || undefined,
          uploaderId: currentUserId || undefined,
          createdAt: new Date().toISOString(),
        };
        const updatedCampaigns = [...campaigns, newCampaign];
        setCampaigns(updatedCampaigns);
        saveCampaignsToLocalStorage(updatedCampaigns);
        toast({ title: "Campaign Imported", description: `"${campaignName}" with ${data.length} leads uploaded.` });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({ title: "CSV Parsing Error", description: "Could not parse the CSV file. Please check its format.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const handleExportCampaign = (campaign: Campaign) => {
    try {
      const csvString = generateCsv(campaign.headers, campaign.data);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${campaign.name.replace(/\s+/g, '_')}_export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Export Successful", description: `Campaign "${campaign.name}" exported.` });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({ title: "Export Failed", description: "Could not export the campaign data.", variant: "destructive" });
    }
  };
  
  const handleDeleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    setCampaigns(updatedCampaigns);
    saveCampaignsToLocalStorage(updatedCampaigns);
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null);
    }
    toast({ title: "Campaign Deleted", description: "The campaign has been removed." });
  };

  const handleDeleteLeads = (campaignId: string, leadIndices: number[]) => {
    setCampaigns(prevCampaigns => {
      const updatedCampaigns = prevCampaigns.map(c => {
        if (c.id === campaignId) {
          const newData = c.data.filter((_, index) => !leadIndices.includes(index));
          return { ...c, data: newData };
        }
        return c;
      });
      saveCampaignsToLocalStorage(updatedCampaigns);
      // Update selectedCampaign if it's the one being modified
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(updatedCampaigns.find(c => c.id === campaignId) || null);
      }
      return updatedCampaigns;
    });
    toast({ title: "Leads Deleted", description: `${leadIndices.length} lead(s) removed from the campaign.` });
  };

  const handleCreateTasksFromLeads = (campaignId: string, leads: CampaignLead[]) => {
    // Basic implementation: For each lead, create a task and prefill some fields.
    // This assumes leads have 'Name' and 'Email' headers for demonstration.
    const newTasks: Task[] = leads.map((lead, index) => ({
      id: `task-from-${campaignId.slice(-4)}-${Date.now()}-${index}`,
      title: `Follow up with ${lead.Name || `Lead ${index + 1}`}`,
      description: `Campaign: ${campaigns.find(c=>c.id === campaignId)?.name || 'N/A'}. Lead details: ${Object.entries(lead).map(([k,v]) => `${k}: ${v}`).join(', ')}`,
      status: 'pending' as TaskStatus,
      type: (lead.Email ? 'email' : 'cold-call') as TaskType, // Example logic for type
      deadline: format(new Date(new Date().setDate(new Date().getDate() + 7)), "yyyy-MM-dd"), // Default to 1 week
      importance: 'medium' as TaskImportance,
      assignedToId: campaigns.find(c=>c.id === campaignId)?.assignedToId || currentUserId || undefined, // Assign to campaign assignee or current user
      createdAt: new Date().toISOString(),
    }));

    setTasks(prevTasks => {
      const combinedTasks = [...newTasks, ...prevTasks];
      saveTasksToLocalStorage(combinedTasks);
      return combinedTasks;
    });

    toast({
      title: "Tasks Created",
      description: `${leads.length} task(s) have been generated from the selected leads and added to the Marketing Tasks list.`,
      duration: 5000,
    });
    // Optionally, clear selection in CampaignDataViewer or close it
  };

  const handleAssignCampaign = (campaignId: string, marketerId: string | "unassigned") => {
     setCampaigns(prevCampaigns => {
        const updated = prevCampaigns.map(c => 
            c.id === campaignId ? {...c, assignedToId: marketerId === "unassigned" ? undefined : marketerId } : c
        );
        saveCampaignsToLocalStorage(updated);
        // If currently viewed campaign is updated, refresh it
        if (selectedCampaign?.id === campaignId) {
            setSelectedCampaign(updated.find(c => c.id === campaignId) || null);
        }
        return updated;
     });
     toast({title: "Campaign Assigned", description: "Campaign assignment updated."});
  };


  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTermTasks.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTermTasks.toLowerCase())
    )
    .filter(task => statusFilter === "all" || task.status === statusFilter)
    .filter(task => importanceFilter === "all" || task.importance === importanceFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const visibleCampaigns = campaigns.filter(campaign => {
      if (currentUserRole === 'admin') return true;
      if (currentUserRole === 'marketer') return campaign.assignedToId === currentUserId || !campaign.assignedToId; // Marketers see assigned or unassigned
      return false;
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  if (selectedCampaign) {
    return (
      <div className="p-4 md:p-6">
        <Button onClick={() => setSelectedCampaign(null)} variant="outline" className="mb-4">
          &larr; Back to Campaigns & Tasks
        </Button>
        <CampaignDataViewer 
          campaign={selectedCampaign} 
          onExport={handleExportCampaign}
          onDeleteLeads={handleDeleteLeads}
          onCreateTasksFromLeads={handleCreateTasksFromLeads}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Campaign Management Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center">
            <FileSpreadsheet className="mr-3 h-7 w-7 text-primary" />Campaign Management
          </h2>
          <CampaignUploadDialog onUpload={handleFileUpload} />
        </div>

        {visibleCampaigns.length === 0 ? (
          <Card className="text-center py-8 bg-muted/30">
            <CardContent>
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold">No Campaigns Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Import a CSV file to start managing your marketing campaigns.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCampaigns.map(campaign => (
              <Card key={campaign.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate" title={campaign.name}>{campaign.name}</CardTitle>
                  <CardDescription>
                    {campaign.data.length} leads. Created {format(new Date(campaign.createdAt), "MMM dd, yyyy")}.
                    {campaign.assignedToId && marketers.find(m=>m.id === campaign.assignedToId) && 
                        <span className="block text-xs mt-1">Assigned to: {marketers.find(m=>m.id === campaign.assignedToId)?.name}</span>
                    }
                     {campaign.assignedToId && !marketers.find(m=>m.id === campaign.assignedToId) && 
                        <span className="block text-xs mt-1 text-muted-foreground italic">Assignee not found</span>
                    }
                    {!campaign.assignedToId && <span className="block text-xs mt-1 text-muted-foreground italic">Unassigned</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   {currentUserRole === 'admin' && (
                    <div className="mb-2">
                        <Label htmlFor={`assign-${campaign.id}`} className="text-xs">Assign to Marketer:</Label>
                        <Select
                            value={campaign.assignedToId || "unassigned"}
                            onValueChange={(value) => handleAssignCampaign(campaign.id, value)}
                        >
                            <SelectTrigger id={`assign-${campaign.id}`} className="h-8 text-xs mt-1">
                                <SelectValue placeholder="Select marketer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {marketers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                {marketers.length === 0 && <SelectItem value="no-marketers" disabled>No marketers available</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>
                   )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedCampaign(campaign)}>
                    <Eye className="mr-2 h-4 w-4" /> View Data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Campaign "{campaign.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the campaign and all its leads. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCampaign(campaign.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete Campaign
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* Task Management Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">Marketing Tasks</h2>
          <TaskFormDialog 
              onSave={handleSaveTask} 
              mode="create" 
              panelType="marketing"
              triggerButton={<Button><PlusCircle className="mr-2 h-4 w-4" /> Add Marketing Task</Button>}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10"
              value={searchTermTasks}
              onChange={(e) => setSearchTermTasks(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(["pending", "in-progress", "completed", "blocked"] as TaskStatus[]).map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={importanceFilter} onValueChange={(value) => setImportanceFilter(value as Task["importance"] | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Importances</SelectItem>
              {(["high", "medium", "low"] as Task["importance"][]).map(i => (
                <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <AIPrioritizationSection tasks={filteredTasks.filter(task => task.type !== 'development' && task.type !== 'design')} onPrioritizedTasks={handlePrioritizedTasks} />

        {filteredTasks.length > 0 ? (
          <div className="masonry-columns md:columns-2 lg:columns-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateTask={handleSaveTask} 
                onDeleteTask={handleDeleteTask}
                onUpdateStatus={handleUpdateStatus}
                panelType="marketing"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">No Tasks Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or add new tasks. Tasks created from campaigns will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
