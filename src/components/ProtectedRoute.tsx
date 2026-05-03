"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100vw', background: 'var(--background)' }}>
        <Loader size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user && pathname.startsWith('/dashboard')) {
    return null;
  }

  return <>{children}</>;
}
