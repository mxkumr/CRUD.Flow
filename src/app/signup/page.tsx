
import { SignupForm } from '@/components/auth/SignupForm';
// AppHeader might not be needed here or a simplified version.

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* <AppHeader /> */}
      <div className="flex-grow flex items-center justify-center p-4">
        <SignupForm />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} CrudFlow. All rights reserved.
      </footer>
    </main>
  );
}
