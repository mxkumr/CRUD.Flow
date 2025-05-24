
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { SignupRequest, SignupRequestStatus } from '@/types';
import { CheckCircle, XCircle, UserCheck, Hourglass, Mail, ShieldQuestion, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const SIGNUP_REQUESTS_STORAGE_KEY = 'signupRequests';

export function PendingRequestsPanel() {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = useCallback(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const storedRequests: SignupRequest[] = JSON.parse(localStorage.getItem(SIGNUP_REQUESTS_STORAGE_KEY) || '[]');
      setRequests(storedRequests.sort((a,b) => parseISO(b.requestedAt).getTime() - parseISO(a.requestedAt).getTime()));
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateRequestStatus = async (requestId: string, newStatus: SignupRequestStatus) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    localStorage.setItem(SIGNUP_REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
    setRequests(updatedRequests); // Update local state to re-render

    toast({
      title: `Request ${newStatus}`,
      description: `User request has been ${newStatus}.`,
    });
  };
  
  const pendingRequests = requests.filter(req => req.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Hourglass className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading requests...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-6 w-6 text-primary" />
          Manage Sign-up Requests
        </CardTitle>
        <CardDescription>
          Review and approve or reject new user sign-up requests. Currently showing {pendingRequests.length} pending requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <Alert variant="default" className="border-primary">
            <ShieldQuestion className="h-4 w-4 text-primary" />
            <AlertTitle>No Pending Requests</AlertTitle>
            <AlertDescription>
              There are currently no new sign-up requests awaiting approval.
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <Card key={request.id} className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{request.name}</CardTitle>
                        <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
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
                  {request.status === 'pending' && (
                    <CardFooter className="flex justify-end gap-2 pt-3 border-t border-border">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateRequestStatus(request.id, 'approved')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
         {requests.filter(req => req.status !== 'pending').length > 0 && (
            <details className="mt-6">
              <summary className="text-sm font-medium text-primary hover:underline cursor-pointer">
                View Processed Requests ({requests.filter(req => req.status !== 'pending').length})
              </summary>
              <ScrollArea className="h-[200px] pr-4 mt-2 border rounded-md p-3">
                <div className="space-y-3">
                {requests.filter(req => req.status !== 'pending').map(request => (
                     <Card key={request.id} className={`bg-muted/20 ${request.status === 'approved' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                        <CardHeader className="p-3">
                             <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">{request.name} ({request.email})</p>
                                <Badge variant={request.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                                    {request.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Role: {request.desiredRole}, Processed: {format(parseISO(request.requestedAt), "MMM dd, yyyy")}</p>
                        </CardHeader>
                    </Card>
                ))}
                </div>
              </ScrollArea>
            </details>
        )}
      </CardContent>
    </Card>
  );
}
