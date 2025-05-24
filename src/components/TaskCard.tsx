
"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import type { Task, SystemUser, TaskStatus } from "@/types";
import { TaskFormData } from "@/lib/schemas";
import { AlertTriangle, CalendarDays, CheckCircle2, Edit, MoreVertical, Tag, Trash2, User, XCircle, AlertCircle, Info } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (data: TaskFormData, id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  panelType?: 'marketing' | 'developer' | 'admin';
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "pending":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "in-progress":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "blocked":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getImportanceVariant = (importance: Task["importance"]): "default" | "secondary" | "destructive" => {
  switch (importance) {
    case "high":
      return "destructive";
    case "medium":
      return "default"; 
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

export function TaskCard({ task, onUpdateTask, onDeleteTask, onUpdateStatus, panelType }: TaskCardProps) {
  const [assignedUser, setAssignedUser] = useState<SystemUser | null | undefined>(undefined); // undefined means not yet checked

  useEffect(() => {
    if (task.assignedToId && typeof window !== 'undefined') {
      const storedUsers: SystemUser[] = JSON.parse(localStorage.getItem('signupRequests') || '[]');
      const user = storedUsers.find(u => u.id === task.assignedToId && u.status === 'approved');
      setAssignedUser(user || null); // null if not found or not approved
    } else {
      setAssignedUser(null); // No assignee or SSR
    }
  }, [task.assignedToId]);


  const handleStatusChange = (status: TaskStatus) => {
    onUpdateStatus(task.id, status);
  };

  return (
    <Card className="w-full break-inside-avoid-column mb-4 shadow-lg bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TaskFormDialog 
                task={task} 
                onSave={onUpdateTask}
                mode="edit"
                panelType={panelType}
                triggerButton={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                 <Edit className="mr-2 h-4 w-4" /> Edit Task
                               </DropdownMenuItem>}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <div className="flex items-center text-sm">
          {getStatusIcon(task.status)}
          <span className="ml-2 capitalize">{task.status}</span>
        </div>
         <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            Due: {format(parseISO(task.deadline), "MMM dd, yyyy")}
          </div>
          {assignedUser === undefined && ( // Still loading
             <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-primary animate-pulse" />
                <span className="italic text-muted-foreground">Loading assignee...</span>
             </div>
          )}
          {assignedUser && ( // User found
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              Assigned to: {assignedUser.name}
            </div>
          )}
          {assignedUser === null && task.assignedToId && ( // ID exists but user not found/approved or unassigned
             <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="italic text-muted-foreground">User not found or unassigned</span>
             </div>
          )}
           {!task.assignedToId && assignedUser === null && ( // Explicitly unassigned
             <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="italic text-muted-foreground">Unassigned</span>
             </div>
          )}
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-primary" />
            Type: <Badge variant="outline" className="ml-1 capitalize">{task.type.replace('-', ' ')}</Badge>
          </div>
           <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
            Importance: <Badge variant={getImportanceVariant(task.importance)} className="ml-1 capitalize">{task.importance}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Created: {format(parseISO(task.createdAt), "MMM dd, yyyy")}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Change Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["pending", "in-progress", "completed", "blocked"] as TaskStatus[]).map(s => (
              <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)} disabled={s === task.status}>
                {getStatusIcon(s)}<span className="ml-2 capitalize">{s}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
