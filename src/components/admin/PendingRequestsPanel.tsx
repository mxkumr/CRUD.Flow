
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { SystemUser, SignupRequestStatus, UserRole } from '@/types';
import { userRoles } from '@/types';
import { CheckCircle, XCircle, UserCheck, Hourglass, Mail, ShieldQuestion, MessageSquare, Edit3, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Added import for Label

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';
const SUPER_ADMIN_EMAIL = 'thecrudstudio@gmail.com';


export function PendingRequestsPanel() {
  const [requests, setRequests] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const storedRequests: SystemUser[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
      setRequests(storedRequests.sort((a, b) => parseISO(b.requestedAt).getTime() - parseISO(a.requestedAt).getTime()));
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateLocalStorageAndState = (updatedRequests: SystemUser[]) => {
    localStorage.setItem(SIGNUP_REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
    setRequests(updatedRequests.sort((a, b) => parseISO(b.requestedAt).getTime() - parseISO(a.requestedAt).getTime()));
  };

  const handleUpdateRequestStatus = async (requestId: string, newStatus: SignupRequestStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    updateLocalStorageAndState(updatedRequests);

    toast({
      title: `Request ${newStatus}`,
      description: `User request has been ${newStatus}.`,
    });
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const userToChange = requests.find(user => user.id === userId);
    if (!userToChange) return;

    const currentAdmins = requests.filter(user => user.status === 'approved' && user.desiredRole === 'admin');
    
    // Safety check: Prevent changing the last admin's role to non-admin
    if (userToChange.desiredRole === 'admin' && newRole !== 'admin' && currentAdmins.length === 1 && userToChange.id === currentAdmins[0].id) {
      toast({
        title: "Action Restricted",
        description: "Cannot change the role of the last administrator.",
        variant: "destructive",
      });
      // Revert UI change if select was optimistic
      setRequests([...requests]); // Trigger re-render to revert select
      return;
    }
    
    // Safety check: Prevent changing role of super admin by other admins (optional, good for strictness)
    // For this demo, we allow super admin's role to be changed if there are other admins.
    // If the super admin is the *only* admin, the above check handles it.

    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedRequests = requests.map(user =>
      user.id === userId ? { ...user, desiredRole: newRole } : user
    );
    updateLocalStorageAndState(updatedRequests);

    toast({
      title: "Role Updated",
      description: `${userToChange.name}'s role changed to ${newRole}.`,
    });

    // If an admin changes their own role, they might need to re-login to see changes reflect in header/access.
    // This is a more complex state management issue beyond this component.
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Assuming email is stored on login
    if (userToChange.email === loggedInUserEmail && userToChange.desiredRole !== newRole) {
        localStorage.setItem('userRole', newRole); // Update current session role
         toast({
            title: "Your Role Changed",
            description: "Your role has been updated. Some changes may require a page refresh or re-login.",
            variant: "default"
        });
    }
  };
  
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Hourglass className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading user data...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-6 w-6 text-primary" />
          User Management
        </CardTitle>
        <CardDescription>
          Review sign-up requests, and manage roles for existing users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Pending Sign-up Requests ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <Alert variant="default" className="border-primary mb-6">
            <ShieldQuestion className="h-4 w-4 text-primary" />
            <AlertTitle>No Pending Requests</AlertTitle>
            <AlertDescription>
              There are currently no new sign-up requests awaiting approval.
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[300px] pr-4 mb-6">
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <Card key={request.id} className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{request.name}</CardTitle>
                        <Badge variant='secondary' className="capitalize">
                            {request.status}
                        </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Requested: {format(parseISO(request.requestedAt), "MMM dd, yyyy 'at' hh:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm pb-3">
                    <p className="flex items-center"><Mail className="mr-2 h-4 w-4 text-primary/80" /> {request.email}</p>
                    <p className="flex items-center"><ShieldQuestion className="mr-2 h-4 w-4 text-primary/80" /> Desired Role: <span className="ml-1 font-medium capitalize">{request.desiredRole}</span></p>
                    {request.message && (
                      <p className="flex items-start pt-1">
                        <MessageSquare className="mr-2 h-4 w-4 text-primary/80 mt-0.5 flex-shrink-0" /> 
                        <span className="italic text-muted-foreground">{request.message}</span>
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}>
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => handleUpdateRequestStatus(request.id, 'approved')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <h3 className="text-lg font-semibold mb-2 mt-8">Manage Existing Users ({processedRequests.length})</h3>
         {processedRequests.length === 0 ? (
             <Alert variant="default">
                <UserCheck className="h-4 w-4" />
                <AlertTitle>No Processed User Requests</AlertTitle>
                <AlertDescription>Once requests are processed, they will appear here.</AlertDescription>
             </Alert>
         ) : (
            <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
            {processedRequests.map(user => (
                 <Card key={user.id} className={`bg-muted/20 ${user.status === 'approved' ? 'border-green-500/30' : 'border-red-500/30'}`}>
                    <CardHeader className="p-3 pb-2">
                         <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{user.name} ({user.email})</p>
                            <Badge variant={user.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                                {user.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Original Request: {user.desiredRole} | Processed: {format(parseISO(user.requestedAt), "MMM dd, yyyy")}
                        </p>
                    </CardHeader>
                    {user.status === 'approved' && (
                      <CardContent className="p-3 pt-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`role-select-${user.id}`} className="text-xs whitespace-nowrap">Current Role:</Label>
                          <Select
                            defaultValue={user.desiredRole}
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserRole)}
                            disabled={user.email === SUPER_ADMIN_EMAIL && requests.filter(u => u.status === 'approved' && u.desiredRole === 'admin').length === 1}
                          >
                            <SelectTrigger id={`role-select-${user.id}`} className="h-8 text-xs flex-grow">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              {userRoles.map(role => (
                                <SelectItem key={role} value={role} className="capitalize text-xs">
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                         {user.email === SUPER_ADMIN_EMAIL && requests.filter(u => u.status === 'approved' && u.desiredRole === 'admin').length === 1 && (
                            <p className="text-xs text-destructive mt-1">Cannot change role of the sole super admin.</p>
                        )}
                      </CardContent>
                    )}
                     {user.status === 'rejected' && (
                         <CardFooter className="p-3 pt-1 flex justify-end">
                            <Button variant="outline" size="xs" onClick={() => handleUpdateRequestStatus(user.id, 'approved')}>
                                <CheckCircle className="mr-1 h-3 w-3" /> Re-approve
                            </Button>
                         </CardFooter>
                     )}
                </Card>
            ))}
            </div>
          </ScrollArea>
         )}
      </CardContent>
    </Card>
  );
}
