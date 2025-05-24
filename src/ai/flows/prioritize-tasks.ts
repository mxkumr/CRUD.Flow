// Prioritize Tasks Flow
'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing tasks based on deadlines and importance.
 *
 * - prioritizeTasks - A function that takes a list of tasks and returns a prioritized order.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string().describe('Unique identifier for the task.'),
  description: z.string().describe('Description of the task.'),
  deadline: z.string().describe('The deadline for the task (YYYY-MM-DD).'),
  importance: z.enum(['high', 'medium', 'low']).describe('Importance level of the task.'),
  type: z.enum(['marketing', 'development']).describe('Type of the task.'),
});

export type Task = z.infer<typeof TaskSchema>;

const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('List of tasks to prioritize.'),
});

export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizedTaskSchema = z.object({
  id: z.string().describe('The task ID.'),
  priority: z.number().describe('The priority of the task (lower is better).'),
  reason: z.string().describe('The reason for the assigned priority.')
});

const PrioritizeTasksOutputSchema = z.array(PrioritizedTaskSchema);

export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prioritizeTasksPrompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI assistant designed to prioritize a list of tasks based on their deadlines and importance.

  Given the following list of tasks:

  {{#each tasks}}
  - ID: {{this.id}}
    Description: {{this.description}}
    Deadline: {{this.deadline}}
    Importance: {{this.importance}}
    Type: {{this.type}}
  {{/each}}

  Prioritize these tasks. Return a prioritized list of tasks, assigning a priority number to each. Lower numbers indicate higher priority.

  Explain the reasoning for each assigned priority.

  Ensure that the response is valid JSON.`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prioritizeTasksPrompt(input);
    return output!;
  }
);
