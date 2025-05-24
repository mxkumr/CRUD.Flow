import type { StaffMember, Task, Client } from '@/types'; // Removed BusinessData

// mockStaff is now largely superseded by dynamic users from signupRequests for task assignment.
// It can be kept for fallback or removed if no longer directly used.
export const mockStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Alice Wonderland', role: 'marketing' },
  { id: 'staff-2', name: 'Bob The Builder', role: 'developer' },
  { id: 'staff-3', name: 'Charlie Chaplin', role: 'admin' },
  { id: 'staff-4', name: 'Diana Prince', role: 'marketing' },
  { id: 'staff-5', name: 'Edward Scissorhands', role: 'developer' },
];

// mockTasks are used for initial population if localStorage is empty for marketing/developer panels.
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Draft Q3 Marketing Email',
    description: 'Prepare the draft for the quarterly marketing email campaign targeting new leads.',
    // assignedToId: 'staff-1', // Initial assignment can be to mock or unassigned
    status: 'pending',
    type: 'email',
    deadline: '2024-08-15',
    importance: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Develop User Auth Module',
    description: 'Implement JWT-based authentication for the new client portal.',
    // assignedToId: 'staff-2',
    status: 'in-progress',
    type: 'development',
    deadline: '2024-08-20',
    importance: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Cold Call 20 Leads',
    description: 'Follow up with the 20 leads generated from the recent webinar.',
    // assignedToId: 'staff-4',
    status: 'pending',
    type: 'cold-call',
    deadline: '2024-08-10',
    importance: 'medium',
    createdAt: new Date().toISOString(),
  },
    {
    id: 'task-4',
    title: 'Client Meeting - Project Alpha',
    description: 'Weekly check-in meeting with Project Alpha stakeholders.',
    // assignedToId: 'staff-1',
    status: 'pending',
    type: 'meeting',
    deadline: '2024-08-05',
    importance: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'UI Design for Dashboard',
    description: 'Create mockups and final UI design for the new admin dashboard.',
    // assignedToId: 'staff-5',
    status: 'pending',
    type: 'design',
    deadline: '2024-08-25',
    importance: 'medium',
    createdAt: new Date().toISOString(),
  },
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Innovatech Ltd.',
    contactPerson: 'Dr. Elara Vance',
    email: 'elara.vance@innovatech.example.com',
    phone: '555-0101',
    projects: ['Phoenix Platform', 'Orion App'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'GreenThumb Gardens',
    contactPerson: 'Mr. Samuel Green',
    email: 'sam.green@greenthumb.example.com',
    phone: '555-0102',
    projects: ['EcoGrow Web Portal'],
    createdAt: new Date().toISOString(),
  },
];

// mockBusinessData removed