"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, User, Target, ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetYear, setTargetYear] = useState("2026");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        targetYear: targetYear,
        createdAt: new Date().toISOString()
      });

      router.push("/dashboard");
    } catch (err: any) {
      if (err.message?.includes("api-key-not-valid") || err.code === "auth/api-key-not-valid") {
        setError("⚠️ Setup Required: Please add your real Firebase API Key to your .env.local file and restart the dev server to enable live authentication.");
      } else {
        setError(err.message || "Failed to register account");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="card glass">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>Join StudyOrbit</h1>
        <p className="text-muted">Start optimizing your JEE prep today</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="flex-col gap-sm">
        <div className="input-group">
          <label className="input-label" htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input id="name" type="text" placeholder="Aryan Kumar" className="input input-with-icon" value={name} onChange={e => setName(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input id="email" type="email" placeholder="aryan@exam.com" className="input input-with-icon" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="target">Target Year</label>
          <div className="input-wrapper">
            <Target className="input-icon" size={18} />
            <select id="target" className="select input-with-icon" value={targetYear} onChange={e => setTargetYear(e.target.value)} required>
              <option value="2024">JEE 2024</option>
              <option value="2025">JEE 2025</option>
              <option value="2026">JEE 2026</option>
              <option value="2027">JEE 2027</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input id="password" type="password" placeholder="••••••••" className="input input-with-icon" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={isLoading}>
          {isLoading ? <Loader size={20} className="animate-spin" /> : "Create Account"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="text-center text-sm text-muted" style={{ marginTop: '2rem' }}>
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium" style={{ textDecoration: 'underline' }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
