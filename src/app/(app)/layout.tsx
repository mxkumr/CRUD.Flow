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
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Role-based redirection if accessing a page not meant for the role
      // This is a simple check, could be more robust
      const currentPathRole = window.location.pathname.split('/')[1];
      if (currentPathRole && role !== currentPathRole && ['admin', 'developer', 'marketing'].includes(currentPathRole)) {
         // If user is on /admin but their role is 'developer', redirect them
         if (role === 'admin') router.replace('/admin');
         else if (role === 'developer') router.replace('/developer');
         else if (role === 'marketer') router.replace('/marketing');
         else router.replace('/login'); // Fallback
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
    // This case should ideally be handled by the redirect,
    // but as a fallback, prevent rendering children.
    // Or show a message "Redirecting to login..."
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader isAuthenticated={true} userRole={userRole} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} AgencyFlow. All rights reserved.
      </footer>
    </div>
  );
}
