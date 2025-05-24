import type { StaffMember, Task, Client, BusinessData } from '@/types';

export const mockStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Alice Wonderland', role: 'marketing' },
  { id: 'staff-2', name: 'Bob The Builder', role: 'developer' },
  { id: 'staff-3', name: 'Charlie Chaplin', role: 'admin' },
  { id: 'staff-4', name: 'Diana Prince', role: 'marketing' },
  { id: 'staff-5', name: 'Edward Scissorhands', role: 'developer' },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Draft Q3 Marketing Email',
    description: 'Prepare the draft for the quarterly marketing email campaign targeting new leads.',
    assignedToId: 'staff-1',
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
    assignedToId: 'staff-2',
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
    assignedToId: 'staff-4',
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
    assignedToId: 'staff-1',
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
    assignedToId: 'staff-5',
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

export const mockBusinessData: BusinessData[] = [
    {
        id: 'biz-1',
        name: 'Gourmet Cafe SF',
        website: 'https://gourmetcafesf.example.com',
        phone: '415-555-0100',
        email: 'contact@gourmetcafesf.example.com',
        address: '123 Main St, San Francisco, CA 94107',
        category: 'Restaurant',
        details: 'Offers organic coffee and pastries.'
    },
    {
        id: 'biz-2',
        name: 'Tech Solutions Inc.',
        website: 'https://techsolutionsinc.example.com',
        phone: '650-555-0123',
        email: 'info@techsolutionsinc.example.com',
        address: '456 Innovation Dr, Palo Alto, CA 94301',
        category: 'IT Services',
        details: 'Provides cloud consulting and software development.'
    },
    {
        id: 'biz-3',
        name: 'City Books & Brews',
        website: 'https://citybooksbrews.example.com',
        phone: '415-555-0155',
        email: 'events@citybooksbrews.example.com',
        address: '789 Literary Ln, San Francisco, CA 94102',
        category: 'Bookstore/Cafe',
        details: 'Independent bookstore with an in-house cafe.'
    }
];
