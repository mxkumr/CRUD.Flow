
import { SignupForm } from '@/components/auth/SignupForm';
import { AppHeader } from '@/components/AppHeader';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* <AppHeader /> Could show a simplified header or none for signup */}
      <div className="flex-grow flex items-center justify-center p-4 bg-background">
        <SignupForm />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border bg-background">
        © {new Date().getFullYear()} AgencyFlow. All rights reserved.
      </footer>
    </main>
  );
}
