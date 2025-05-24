
import { z } from 'zod';
import { taskStatuses, taskTypes, taskImportances, userRoles } from '@/types';

export const TaskFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  assignedToId: z.string().optional(),
  status: z.enum(taskStatuses as [string, ...string[]]), // Zod enum needs string array
  type: z.enum(taskTypes as [string, ...string[]]),
  deadline: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Deadline must be in YYYY-MM-DD format.",
  }),
  importance: z.enum(taskImportances as [string, ...string[]]),
});
export type TaskFormData = z.infer<typeof TaskFormSchema>;


export const ClientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Client name must be at least 2 characters."),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(7, "Phone number seems too short.").refine(val => /^[+]?[\d\s-()]+$/.test(val), { message: "Invalid phone number format."}),
  projects: z.string().transform(val => val.split(',').map(p => p.trim()).filter(p => p.length > 0)), // Input as comma-separated string
});
export type ClientFormData = z.infer<typeof ClientFormSchema>;

// DataRequestFormSchema and DataRequestFormData removed

export const SignupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  desiredRole: z.enum(userRoles as [UserRole, ...UserRole[]]),
  message: z.string().min(10, "Please provide a brief message (min 10 characters).").optional(),
  // We are not asking for password at signup, admin grants access.
});
export type SignupFormData = z.infer<typeof SignupFormSchema>;
