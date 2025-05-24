"use client";

import React, { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, ListChecks } from "lucide-react";
import type { Task } from "@/types";
import { mapToAITask } from '@/types';
import { prioritizeTasks, PrioritizeTasksOutput } from '@/ai/flows/prioritize-tasks';
import { useToast } from "@/hooks/use-toast";

interface AIPrioritizationSectionProps {
  tasks: Task[];
  onPrioritizedTasks: (prioritizedTasks: Task[]) => void; // Callback to update parent's task list
}

export function AIPrioritizationSection({ tasks, onPrioritizedTasks }: AIPrioritizationSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [prioritizedOrder, setPrioritizedOrder] = useState<PrioritizeTasksOutput | null>(null);
  const { toast } = useToast();

  const handlePrioritizeTasks = () => {
    if (tasks.length === 0) {
      toast({
        title: "No tasks to prioritize",
        description: "Please add some tasks before using the AI prioritizer.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const aiTasks = tasks.map(mapToAITask);
        const result = await prioritizeTasks({ tasks: aiTasks });
        setPrioritizedOrder(result);
        
        // Create a new sorted list of tasks based on AI priority
        const tasksById = new Map(tasks.map(task => [task.id, task]));
        const newlySortedTasks: Task[] = [];
        const unsortedTasks: Task[] = [];

        result.forEach(pTask => {
          const originalTask = tasksById.get(pTask.id);
          if (originalTask) {
            newlySortedTasks.push(originalTask);
            tasksById.delete(pTask.id); // remove from map to track unsorted
          }
        });
        
        // Add any tasks not prioritized by AI (e.g. if AI failed on some) to the end
        tasksById.forEach(task => unsortedTasks.push(task));
        
        onPrioritizedTasks([...newlySortedTasks, ...unsortedTasks]);

        toast({
          title: "Tasks Prioritized!",
          description: "AI has suggested a new order for your tasks.",
        });
      } catch (error) {
        console.error("Error prioritizing tasks:", error);
        toast({
          title: "Prioritization Failed",
          description: "Could not prioritize tasks. Please try again later.",
          variant: "destructive",
        });
        setPrioritizedOrder(null);
      }
    });
  };

  const getTaskDescription = (taskId: string): string => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : "Unknown Task";
  };

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Task Prioritizer
        </CardTitle>
        <CardDescription>
          Let AI suggest an optimal order for your tasks based on deadline and importance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 && (
           <Alert variant="default" className="border-primary">
             <ListChecks className="h-4 w-4 text-primary" />
             <AlertTitle>No Tasks Available</AlertTitle>
             <AlertDescription>
               Add tasks to this panel to enable AI prioritization.
             </AlertDescription>
           </Alert>
        )}
        {prioritizedOrder && prioritizedOrder.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Suggested Priority:</h4>
            <ScrollArea className="h-[200px] rounded-md border p-3">
              <ul className="space-y-2">
                {prioritizedOrder.sort((a,b) => a.priority - b.priority).map((pTask, index) => (
                  <li key={pTask.id} className="text-sm p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">{index + 1}. {getTaskDescription(pTask.id)} (ID: {pTask.id})</span>
                    <p className="text-xs text-muted-foreground ml-4 mt-1">- {pTask.reason}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handlePrioritizeTasks} disabled={isPending || tasks.length === 0} className="w-full">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Prioritizing..." : "Prioritize Tasks with AI"}
        </Button>
      </CardFooter>
    </Card>
  );
}
