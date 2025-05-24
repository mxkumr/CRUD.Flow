
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, UserPlus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignupFormSchema, type SignupFormData } from '@/lib/schemas';
import type { SignupRequest, UserRole } from '@/types';
import { userRoles } from '@/types'; // Import userRoles array

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      desiredRole: undefined,
      message: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    const newRequest: SignupRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    try {
      // Simulate API call & store in localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      const existingRequests: SignupRequest[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
      
      // Check if email already has a pending or approved request
      const conflictingRequest = existingRequests.find(
        req => req.email === newRequest.email && (req.status === 'pending' || req.status === 'approved')
      );

      if (conflictingRequest) {
        if (conflictingRequest.status === 'pending') {
          toast({
            title: 'Request Already Submitted',
            description: 'You already have a pending request with this email. Please wait for admin approval.',
            variant: 'destructive',
          });
        } else { // approved
           toast({
            title: 'Account Exists',
            description: 'An account with this email has already been approved. Please try logging in.',
            variant: 'destructive',
          });
        }
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem(SIGNUP_REQUESTS_STORAGE_KEY, JSON.stringify([...existingRequests, newRequest]));

      toast({
        title: 'Request Submitted Successfully!',
        description: 'Your request has been sent to the admin for approval.',
      });
      form.reset();
      // Optionally redirect or show a success message inline
      // router.push('/login'); 
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: 'Signup Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <UserPlus className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Request Access</CardTitle>
        <CardDescription>Fill out the form below to request an account. Admin approval is required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" {...form.register('name')} disabled={isLoading} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" {...form.register('email')} disabled={isLoading} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="desiredRole">Desired Role</Label>
            <Select 
              onValueChange={(value) => form.setValue('desiredRole', value as UserRole)} 
              defaultValue={form.getValues('desiredRole')}
              disabled={isLoading}
            >
              <SelectTrigger id="desiredRole">
                <SelectValue placeholder="Select desired role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.desiredRole && <p className="text-sm text-destructive">{form.formState.errors.desiredRole.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea id="message" placeholder="Briefly explain why you need access..." {...form.register('message')} disabled={isLoading} />
            {form.formState.errors.message && <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" /> Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Request
              </>
            )}
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p>Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/login')}>Login here</Button></p>
      </CardFooter>
    </Card>
  );
}

// Helper so we don't have to spread Form from react-hook-form everywhere
// This is a common pattern for ShadCN forms.
// We'll just use the direct form.register method for simplicity here.
const Form = ({ children, onSubmit, className }: { children: React.ReactNode; onSubmit: () => void; className?: string; }) => (
  <form onSubmit={onSubmit} className={className}>
    {children}
  </form>
);
