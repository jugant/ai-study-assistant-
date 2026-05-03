import Link from 'next/link';
import { BrainCircuit, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="container flex-between" style={{ height: '100%' }}>
        <Link href="/" className="navbar-brand">
          <BrainCircuit className="text-primary" size={28} />
          <span>Study<span className="text-gradient">Orbit</span></span>
        </Link>
        <div className="flex-row gap-md">
          <Link href="/login" className="btn btn-secondary btn-sm">
            <LogIn size={16} /> Login
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
