
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react'; // Removed Briefcase
import { useToast } from '@/hooks/use-toast';
import type { SignupRequest } from '@/types'; // SystemUser is aliased as SignupRequest

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState<SignupRequest[]>([]);

  useEffect(() => {
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

    await new Promise(resolve => setTimeout(resolve, 1000));

    const specialAdminEmail = 'thecrudstudio@gmail.com';
    const specialAdminPassword = 'password!@#';

    if (email.toLowerCase() === specialAdminEmail && password === specialAdminPassword) {
      let allRequests: SignupRequest[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
      const existingApprovedAdmins = allRequests.filter(req => 
        req.status === 'approved' && 
        req.desiredRole === 'admin' && 
        req.email.toLowerCase() !== specialAdminEmail
      );

      if (existingApprovedAdmins.length === 0) {
        localStorage.setItem('authToken', `mock-token-for-${email}`);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('loggedInUserEmail', email.toLowerCase()); // Store email

        toast({
          title: 'Super Admin Login Successful',
          description: 'Welcome, initial administrator!',
        });

        let specialAdminRequest = allRequests.find(req => req.email.toLowerCase() === specialAdminEmail);
        let requestsUpdated = false;
        if (specialAdminRequest) {
          if (specialAdminRequest.status !== 'approved' || specialAdminRequest.desiredRole !== 'admin') {
            specialAdminRequest.status = 'approved';
            specialAdminRequest.desiredRole = 'admin';
            requestsUpdated = true;
          }
        } else {
          const newSpecialAdminRequest: SignupRequest = {
            id: `req-special-${Date.now()}`,
            name: 'Super Admin',
            email: specialAdminEmail,
            desiredRole: 'admin',
            status: 'approved',
            requestedAt: new Date().toISOString(),
            message: 'Initial super admin account.',
          };
          allRequests.push(newSpecialAdminRequest);
          requestsUpdated = true;
        }

        if (requestsUpdated) {
           localStorage.setItem(SIGNUP_REQUESTS_STORAGE_KEY, JSON.stringify(allRequests));
           setApprovedUsers(allRequests.filter(req => req.status === 'approved'));
        }
        
        router.push('/');
        setIsLoading(false);
        return; 
      }
    }

    const userToLogin = approvedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (userToLogin) {
      localStorage.setItem('authToken', `mock-token-for-${email}`);
      localStorage.setItem('userRole', userToLogin.desiredRole);
      localStorage.setItem('loggedInUserEmail', userToLogin.email.toLowerCase()); // Store email

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userToLogin.name}! Role: ${userToLogin.desiredRole}.`,
      });
      
      router.push('/'); 
    } else {
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
          description: 'Invalid credentials or account not approved/found. Please sign up or contact admin.',
          variant: 'destructive',
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        {/* Replaced Briefcase icon with styled text for app name */}
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-4xl font-extrabold text-primary tracking-tight">CRUD.</span>
          <h1 className="text-4xl font-bold text-foreground">Flow</h1>
        </div>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Access your dashboard. Admin approval required for new accounts.</CardDescription>
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
        <p>For demo: any password works after admin approval. Super Admin: thecrudstudio@gmail.com / password!@# (if no other admins).</p>
        <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push('/signup')}>
          <UserPlus className="mr-2 h-4 w-4" /> Don't have an account? Request Access
        </Button>
      </CardFooter>
    </Card>
  );
}
