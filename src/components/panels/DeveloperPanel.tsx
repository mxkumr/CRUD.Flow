
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
import { mockTasks } from "@/lib/constants"; // We will filter these by type, but assignment will use real users
import { PlusCircle, Search, Filter } from "lucide-react";

export function DeveloperPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [importanceFilter, setImportanceFilter] = useState<Task["importance"] | "all">("all");

  useEffect(() => {
    const devTaskTypes: Task["type"][] = ['development', 'design', 'research', 'meeting'];
    // For initial load, still use mockTasks, but filter for developer relevant types
    // In a real backend, tasks would be fetched for the developer or their team.
    // For now, we use localStorage for persistence.
    const storedTasks = JSON.parse(localStorage.getItem('developerTasks') || 'null');
    if (storedTasks) {
      setTasks(storedTasks);
    } else {
      const initialDevTasks = mockTasks.filter(task => devTaskTypes.includes(task.type));
      setTasks(initialDevTasks);
      localStorage.setItem('developerTasks', JSON.stringify(initialDevTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem('developerTasks', JSON.stringify(updatedTasks));
  };

  const handleSaveTask = (data: TaskFormData, id?: string) => {
    let updatedTasks;
    if (id) {
      updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, ...data } : task
      );
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...data,
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
    // Note: AI prioritization might not persist to localStorage unless explicitly saved after this.
    // For simplicity, current AI prioritization is session-based for the view.
    // To persist: saveTasksToLocalStorage(prioritizedTasks);
  };

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => statusFilter === "all" || task.status === statusFilter)
    .filter(task => importanceFilter === "all" || task.importance === importanceFilter)
    // Default sort can be by AI priority if applied, or by creation/deadline.
    // For now, relying on AI section to reorder if used, otherwise it's creation order (newest first due to how tasks are added).
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-foreground">Developer Tasks</h2>
        <TaskFormDialog 
          onSave={handleSaveTask} 
          mode="create" 
          panelType="developer"
          triggerButton={<Button><PlusCircle className="mr-2 h-4 w-4" /> Add Developer Task</Button>}
        />
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
              panelType="developer"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Developer Tasks Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or add new developer tasks.
          </p>
        </div>
      )}
    </div>
  );
}
