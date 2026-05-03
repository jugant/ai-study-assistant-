"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BrainCircuit, LayoutDashboard, BookOpen, Brain, 
  Calendar, Settings, LogOut, Bell, User
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userData, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Notes", href: "/dashboard/notes", icon: BookOpen },
    { name: "MCQ Generator", href: "/dashboard/mcq", icon: Brain },
    { name: "Study Planner", href: "/dashboard/planner", icon: Calendar },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="app-layout">
        {/* Sidebar */}
      <aside className="sidebar fixed z-40">
        <div className="sidebar-header">
          <Link href="/" className="navbar-brand">
            <BrainCircuit className="text-primary" size={28} />
            <span>Study<span className="text-gradient">Orbit</span></span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon size={20} className={isActive ? "text-primary" : "text-muted"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={() => logout()} className="sidebar-link w-full text-danger border-none cursor-pointer" style={{ background: 'var(--danger-bg)' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Component */}
      <div className="main-content">
        <header className="topbar">
          <div className="flex-row gap-lg">
            <h2 className="text-xl font-bold" style={{ display: 'none' }} >
              {/* Responsive Hidden, wait, inline style display none isn't needed here */}
              {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex-row gap-md">
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', width: '0.5rem', height: '0.5rem', background: 'var(--danger)', borderRadius: '50%' }}></span>
            </button>
            <div className="flex-row gap-sm pl-4 border-l border-[--glass-border]" style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
              <div className="text-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div className="text-sm font-bold">{userData?.displayName || 'Aspirant'}</div>
                <div className="text-xs text-muted">JEE {userData?.targetYear || 'Aspirant'}</div>
              </div>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-container animate-fade-in">
          {children}
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
