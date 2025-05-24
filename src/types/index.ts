
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
  assignedToId?: string; // Store ID of staff member or approved user
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

// BusinessData type removed as Data Request feature is removed

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

export type UserRole = 'admin' | 'developer' | 'marketer';
export const userRoles: UserRole[] = ['admin', 'developer', 'marketer'];

export type SignupRequestStatus = 'pending' | 'approved' | 'rejected';

// This type represents a user in the system, whether their request is pending, approved, or rejected.
// If approved, `desiredRole` becomes their actual role.
export type SystemUser = {
  id: string;
  name: string;
  email: string;
  desiredRole: UserRole; // For pending requests, this is what they asked for. For approved users, this is their current role.
  status: SignupRequestStatus;
  requestedAt: string; // ISO date string
  message?: string;
};

// Using SystemUser as the primary type for signup requests and general user representation.
export type SignupRequest = SystemUser;


// Helper function to get active users for assignment dropdowns
export const getAssignableUsers = (panelType?: 'marketing' | 'developer' | 'admin'): SystemUser[] => {
  if (typeof window === 'undefined') return []; // Guard for SSR
  const storedUsers: SystemUser[] = JSON.parse(localStorage.getItem('signupRequests') || '[]');
  const approvedUsers = storedUsers.filter(user => user.status === 'approved');

  if (panelType === 'developer') {
    return approvedUsers.filter(user => user.desiredRole === 'developer' || user.desiredRole === 'admin');
  }
  if (panelType === 'marketing') {
    return approvedUsers.filter(user => user.desiredRole === 'marketer' || user.desiredRole === 'admin');
  }
  // If no panelType or admin, return all approved users. Admins can be assigned any task.
  return approvedUsers;
};
