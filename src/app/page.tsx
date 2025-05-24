'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (authToken && userRole) {
      // User is authenticated, redirect to their role-specific page
      if (userRole === 'admin') {
        router.replace('/admin');
      } else if (userRole === 'developer') {
        router.replace('/developer');
      } else if (userRole === 'marketer') {
        router.replace('/marketing');
      } else {
        // Fallback or error if role is unknown
        console.error('Unknown user role:', userRole);
        router.replace('/login'); // Or a generic dashboard/error page
      }
    } else {
      // User is not authenticated, redirect to login
      router.replace('/login');
    }
    // Set loading to false after a short delay to allow redirect to happen
    // or show loading indicator if preferred
    // For now, keeping it simple; redirection should be quick.
    // If this page were to render content, then setIsLoading(false) would be here.
  }, [router]);

  // Optionally, show a loading spinner while redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return null; // Or a fallback UI if redirection takes time / fails silently
}
