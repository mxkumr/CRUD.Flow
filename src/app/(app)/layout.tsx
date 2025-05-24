
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Fetch email
    
    if (token && role && loggedInUserEmail) { // Ensure email is also present
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Role-based redirection
      const currentPath = window.location.pathname;
      const currentPathBase = currentPath.split('/')[1]; // e.g., 'admin', 'developer'

      if (['admin', 'developer', 'marketing'].includes(currentPathBase) && role !== currentPathBase) {
         // If user is on /admin but their role is 'developer', redirect them
         if (role === 'admin' && currentPathBase !== 'admin') router.replace('/admin');
         else if (role === 'developer' && currentPathBase !== 'developer') router.replace('/developer');
         else if (role === 'marketer' && currentPathBase !== 'marketing') router.replace('/marketing');
         // If they are on a non-role page like '/', redirect handled by src/app/page.tsx
      }

    } else {
      router.replace('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader isAuthenticated={true} userRole={userRole} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} CrudFlow. All rights reserved.
      </footer>
    </div>
  );
}
