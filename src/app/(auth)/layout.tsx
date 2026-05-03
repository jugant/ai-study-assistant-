import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', position: 'relative' }}>
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BrainCircuit className="text-primary" size={28} />
        <span className="font-bold text-xl">
          Study<span className="text-gradient">Orbit</span>
        </span>
      </Link>
      
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
