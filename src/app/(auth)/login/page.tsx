"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Loader, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If already logged in, go straight to dashboard
        router.push("/dashboard");
      } else {
        // If not logged in, show the login form
        setIsPageLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      default:
        return 'An error occurred during login. Please try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // We don't need router.push here because onAuthStateChanged will detect 
      // the login and automatically redirect to /dashboard
    } catch (err: any) {
      if (err.message?.includes("api-key-not-valid") || err.code === "auth/api-key-not-valid") {
        setError("⚠️ Setup Required: Please add your real Firebase API Key to your .env.local file and restart the dev server.");
      } else {
        setError(getFriendlyErrorMessage(err.code));
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      }
      // redirect handled by onAuthStateChanged
    } catch (err: any) {
      if (err.message?.includes("api-key-not-valid") || err.code === "auth/api-key-not-valid") {
        setError("⚠️ Setup Required: Please add your real Firebase API Key to your .env.local file and restart the dev server.");
      } else {
        setError(getFriendlyErrorMessage(err.code));
      }
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
        <Loader size={40} style={{ color: 'var(--primary)' }} className="animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="card glass">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p className="text-muted">Enter your details to access your account</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid var(--danger)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex-col gap-md">
        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="input input-with-icon" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="flex-between">
            <label className="input-label" htmlFor="password">Password</label>
            <Link href="#" className="text-xs text-primary font-medium" style={{ textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          <div className="input-wrapper" style={{ position: 'relative' }}>
            <Lock className="input-icon" size={18} />
            <input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="input input-with-icon" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
              style={{ paddingRight: '2.5rem' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full flex-center" style={{ marginTop: '0.5rem' }} disabled={isLoading}>
          {isLoading ? (
            <Loader size={20} className="animate-spin-slow" />
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>

        <div style={{ position: 'relative', margin: '1.5rem 0', textAlign: 'center' }}>
          <hr style={{ borderColor: 'var(--card-border)', borderTopWidth: '1px' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--card-bg)', padding: '0 1rem', fontSize: '0.75rem', color: 'var(--muted)', borderRadius: '1rem' }}>
            OR
          </span>
        </div>

        <button type="button" className="btn btn-secondary btn-full flex-center" style={{ gap: '0.5rem' }} onClick={handleGoogleLogin} disabled={isLoading}>
          <svg className="w-5 h-5" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="text-center text-sm text-muted" style={{ marginTop: '2rem' }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-medium" style={{ textDecoration: 'underline' }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
