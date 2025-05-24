"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { AIPrioritizationSection } from "@/components/AIPrioritizationSection";
import type { Task, TaskStatus } from "@/types";
import { TaskFormData } from "@/lib/schemas";
import { mockTasks } from "@/lib/constants";
import { PlusCircle, Search, Filter } from "lucide-react";

export function MarketingPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [importanceFilter, setImportanceFilter] = useState<Task["importance"] | "all">("all");
  
  // Load marketing tasks on mount
  useEffect(() => {
    const marketingTaskTypes: Task["type"][] = ['cold-call', 'email', 'content-creation', 'research', 'meeting'];
    setTasks(mockTasks.filter(task => marketingTaskTypes.includes(task.type)));
  }, []);

  const handleSaveTask = (data: TaskFormData, id?: string) => {
    if (id) {
      // Edit existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, ...data, assignedToId: data.assignedToId === "unassigned" ? undefined : data.assignedToId } : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...data,
        assignedToId: data.assignedToId === "unassigned" ? undefined : data.assignedToId,
        createdAt: new Date().toISOString(),
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, status } : task))
    );
  };
  
  const handlePrioritizedTasks = (prioritizedTasks: Task[]) => {
    // This will re-order based on AI, ensuring only marketing tasks are affected if this panel's tasks were passed.
    // Or, if all tasks were passed to AI, it filters back to marketing tasks.
    // For simplicity, assuming `prioritizedTasks` contains the reordered version of the current panel's tasks.
    setTasks(prioritizedTasks);
  };

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => statusFilter === "all" || task.status === statusFilter)
    .filter(task => importanceFilter === "all" || task.importance === importanceFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Default sort by newest

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">Marketing Tasks</h2>
        <TaskFormDialog onSave={handleSaveTask} mode="create" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(["pending", "in-progress", "completed", "blocked"] as TaskStatus[]).map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
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
      
      <AIPrioritizationSection tasks={filteredTasks} onPrioritizedTasks={handlePrioritizedTasks} />

      {filteredTasks.length > 0 ? (
        <div className="masonry-columns md:columns-2 lg:columns-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onUpdateTask={handleSaveTask} 
              onDeleteTask={handleDeleteTask}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Tasks Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or add new tasks.
          </p>
        </div>
      )}
    </div>
  );
}
