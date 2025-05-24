export type StaffMember = {
  id: string;
  name: string;
  role: 'marketing' | 'developer' | 'admin';
};

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';
export const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed', 'blocked'];

export type TaskType = 'cold-call' | 'email' | 'development' | 'design' | 'research' | 'content-creation' | 'meeting';
export const taskTypes: TaskType[] = ['cold-call', 'email', 'development', 'design', 'research', 'content-creation', 'meeting'];


export type TaskImportance = 'high' | 'medium' | 'low';
export const taskImportances: TaskImportance[] = ['high', 'medium', 'low'];

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedToId?: string; // Store ID of staff member
  status: TaskStatus;
  type: TaskType;
  deadline: string; // YYYY-MM-DD
  importance: TaskImportance;
  createdAt: string; // ISO date string
};

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  projects: string[]; // List of project names or IDs
  createdAt: string; // ISO date string
};

export type BusinessData = {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  category?: string;
  details?: string;
};

// For AI Task Prioritization, mapping our Task to the AI's expected Task format
import type { Task as AITaskInput } from '@/ai/flows/prioritize-tasks';

export function mapToAITask(task: Task): AITaskInput {
  let aiTaskType: 'marketing' | 'development' = 'marketing'; // Default
  if (['development', 'design'].includes(task.type)) {
    aiTaskType = 'development';
  } else if (['cold-call', 'email', 'content-creation', 'research'].includes(task.type)) {
    aiTaskType = 'marketing';
  }

  return {
    id: task.id,
    description: `${task.title} - ${task.description}`, // Combine title and desc for more context to AI
    deadline: task.deadline,
    importance: task.importance,
    type: aiTaskType,
  };
}
