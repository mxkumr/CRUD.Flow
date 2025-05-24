
import { LoginForm } from '@/components/auth/LoginForm';
// AppHeader is not typically shown on a dedicated login page, or a simplified one is used.
// If AppHeader is desired here, ensure it handles unauthenticated state gracefully.

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* <AppHeader /> */}
      <div className="flex-grow flex items-center justify-center p-4">
        <LoginForm />
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} CrudFlow. All rights reserved.
      </footer>
    </main>
  );
}
