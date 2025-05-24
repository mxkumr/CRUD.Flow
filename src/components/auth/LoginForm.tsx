
'use client';

import { useState, useEffect } from 'react';
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
import { Briefcase, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SignupRequest, UserRole } from '@/types';

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';

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
  // Role selection on login form is removed as role is determined by approved signup request.
  // const [role, setRole] = useState<UserRole | ''>(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState<SignupRequest[]>([]);

  useEffect(() => {
    // Load approved users from localStorage
    const storedRequests: SignupRequest[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
    setApprovedUsers(storedRequests.filter(req => req.status === 'approved'));
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
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

    const approvedUser = approvedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (approvedUser) {
      // Mock authentication: any non-empty password is valid for an approved user
      localStorage.setItem('authToken', `mock-token-for-${email}`);
      localStorage.setItem('userRole', approvedUser.desiredRole);

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${approvedUser.desiredRole}!`,
      });
      
      router.push('/'); 
    } else {
       // Check if there's a pending request for this email
      const allRequests: SignupRequest[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
      const pendingRequest = allRequests.find(req => req.email.toLowerCase() === email.toLowerCase() && req.status === 'pending');
      const rejectedRequest = allRequests.find(req => req.email.toLowerCase() === email.toLowerCase() && req.status === 'rejected');

      if (pendingRequest) {
        toast({
          title: 'Login Failed',
          description: 'Your account request is still pending approval.',
          variant: 'destructive',
        });
      } else if (rejectedRequest) {
         toast({
          title: 'Login Failed',
          description: 'Your account request was not approved. Please contact an administrator.',
          variant: 'destructive',
        });
      }
      else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials or account not approved. Please sign up if you don\'t have an account.',
          variant: 'destructive',
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Briefcase className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">AgencyFlow Login</CardTitle>
        <CardDescription>Access your agency dashboard. Admin approval required for new accounts.</CardDescription>
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
          {/* Role selection removed from login, determined by signup approval
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
          */}
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
      <CardFooter className="flex flex-col gap-2 items-center text-xs text-muted-foreground">
        <p>Use any password for demo after admin approval.</p>
        <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push('/signup')}>
          <UserPlus className="mr-2 h-4 w-4" /> Don't have an account? Request Access
        </Button>
      </CardFooter>
    </Card>
  );
}
