'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'developer' | 'marketer';

const availableRoles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'developer', label: 'Developer' },
  { value: 'marketer', label: 'Marketer' },
];

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !role) {
      toast({
        title: 'Login Failed',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication: any non-empty email/password is valid
    // In a real app, you would verify credentials against a backend.
    localStorage.setItem('authToken', `mock-token-for-${email}`);
    localStorage.setItem('userRole', role);

    toast({
      title: 'Login Successful',
      description: `Welcome back, ${role}!`,
    });
    
    // Redirect to the main page, which will then redirect to the role-specific dashboard
    router.push('/'); 
    // router.refresh(); // To ensure the layout re-evaluates auth state if needed

    // setIsLoading(false); // Component might unmount before this runs
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Briefcase className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">AgencyFlow Login</CardTitle>
        <CardDescription>Access your agency dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <LogIn className="mr-2 h-4 w-4 animate-pulse" /> Authenticating...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        <p>Use any email/password for demo.</p>
      </CardFooter>
    </Card>
  );
}
