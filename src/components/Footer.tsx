import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass" style={{ borderTop: '1px solid var(--glass-border)', padding: '2rem 0', marginTop: 'auto' }}>
      <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="font-bold text-xl">
            Study<span className="text-gradient">Orbit</span>
          </span>
          <p className="text-muted text-sm mt-1">
            AI-powered study workflow for JEE aspirants.
          </p>
        </div>
        <div className="text-sm text-muted">
          &copy; {new Date().getFullYear()} StudyOrbit. All rights reserved.
        </div>
        <div className="flex-row gap-md text-sm text-muted">
          <Link href="#" style={{ transition: 'color 0.2s' }}>Privacy</Link>
          <Link href="#" style={{ transition: 'color 0.2s' }}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}
