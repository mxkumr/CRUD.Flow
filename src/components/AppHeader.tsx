
'use client';

import { LogOut, UserCircle } from 'lucide-react'; // Removed Briefcase
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
    localStorage.removeItem('loggedInUserEmail'); // Also clear loggedInUserEmail
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  return (
    <header className="py-4 px-4 md:px-6 border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-baseline gap-1 cursor-pointer" onClick={() => router.push('/')}>
          {/* Text-based logo */}
          <span className="text-3xl font-extrabold text-primary tracking-tight">CRUD.</span>
          <h1 className="text-3xl font-bold text-foreground">Flow</h1>
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
