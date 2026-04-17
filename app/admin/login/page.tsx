import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-slate-400">
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
