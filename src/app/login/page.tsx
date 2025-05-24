import { LoginForm } from '@/components/auth/LoginForm';
import { AppHeader } from '@/components/AppHeader'; // Assuming AppHeader should be shown on login page too

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* AppHeader might not be needed here or a simplified version */}
      {/* <AppHeader />  */}
      <div className="flex-grow flex items-center justify-center p-4">
        <LoginForm />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} AgencyFlow. All rights reserved.
      </footer>
    </main>
  );
}
