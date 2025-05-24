'use client';

import { Briefcase, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AppHeaderProps {
  isAuthenticated?: boolean;
  userRole?: string | null;
}

export function AppHeader({ isAuthenticated, userRole }: AppHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  // This component might be rendered outside the (app) layout context (e.g. on a public login page without props)
  // So we need to handle the case where isAuthenticated/userRole are not passed.
  // For a truly global header, it might need its own context or to always fetch from localStorage.
  // For now, assuming it's primarily used within authenticated contexts or props are passed.

  return (
    <header className="py-4 px-4 md:px-6 border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">AgencyFlow</h1>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {userRole && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <UserCircle className="h-4 w-4" />
                Role: <span className="font-semibold capitalize">{userRole}</span>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
