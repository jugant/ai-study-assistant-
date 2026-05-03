"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { BookOpen, Brain, Calendar, Clock, Target, ChevronRight } from "lucide-react";

export default function DashboardHome() {
  const [greeting, setGreeting] = useState("Good morning");
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ notes: 0, mcqs: 0, plans: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        const notesRef = collection(db, `users/${user.uid}/notes`);
        const mcqsRef = collection(db, `users/${user.uid}/mcqs`);
        const plansRef = collection(db, `users/${user.uid}/plans`);

        const [notesSnap, mcqsSnap, plansSnap] = await Promise.all([
          getDocs(query(notesRef, orderBy("timestamp", "desc"), limit(5))),
          getDocs(query(mcqsRef, orderBy("timestamp", "desc"), limit(5))),
          getDocs(query(plansRef, orderBy("timestamp", "desc"), limit(5)))
        ]);

        setStats({
          notes: notesSnap.size,
          mcqs: mcqsSnap.size,
          plans: plansSnap.size
        });

        const recentActs: any[] = [];
        notesSnap.forEach(doc => {
          recentActs.push({ title: "Note Summary", time: new Date(doc.data().timestamp).toLocaleDateString(), type: "Content Processed", icon: BookOpen, typeClass: "primary", ts: doc.data().timestamp });
        });
        mcqsSnap.forEach(doc => {
          recentActs.push({ title: `${doc.data().topic} Quiz`, time: new Date(doc.data().timestamp).toLocaleDateString(), type: `Score ${doc.data().score}/${doc.data().total}`, icon: Brain, typeClass: "secondary", ts: doc.data().timestamp });
        });
        plansSnap.forEach(doc => {
          recentActs.push({ title: "Study Plan", time: new Date(doc.data().timestamp).toLocaleDateString(), type: `Target: ${doc.data().examDate}`, icon: Calendar, typeClass: "success", ts: doc.data().timestamp });
        });

        recentActs.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
        setActivities(recentActs.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="flex-col gap-xl">
      {/* Welcome Section */}
      <div className="page-header">
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>{greeting}, {user?.displayName || "Student"}! 👋</h1>
        <p className="text-muted">You have 4 tasks pending for today. Keep up the momentum!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid-3">
        <div className="card flex-col gap-sm">
          <div className="flex-between">
            <div className="icon-box icon-box-primary"><BookOpen size={20} /></div>
          </div>
          <div>
            <div className="text-3xl font-bold">{loading ? "-" : stats.notes}</div>
            <div className="text-muted text-sm font-medium">Notes Processed</div>
          </div>
        </div>

        <div className="card flex-col gap-sm">
          <div className="flex-between">
            <div className="icon-box icon-box-secondary"><Brain size={20} /></div>
          </div>
          <div>
            <div className="text-3xl font-bold">{loading ? "-" : stats.mcqs}</div>
            <div className="text-muted text-sm font-medium">MCQs Taken</div>
          </div>
        </div>

        <div className="card flex-col gap-sm">
          <div className="flex-between">
            <div className="icon-box icon-box-success"><Calendar size={20} /></div>
          </div>
          <div>
            <div className="text-3xl font-bold">{loading ? "-" : stats.plans}</div>
            <div className="text-muted text-sm font-medium">Plans Generated</div>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ gap: '2rem' }}>
        {/* Recent Activity */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 className="text-xl">Recent Activity</h2>
            <Link href="#" className="text-primary text-sm font-medium" style={{ textDecoration: 'underline' }}>View All</Link>
          </div>
          
          <div className="flex-col gap-sm">
            {loading ? (
              <div className="text-muted text-center py-4">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="text-muted text-center py-4">No recent activity found.</div>
            ) : (
              activities.map((item, i) => {
                const Icon = item.icon;
                return (
                <div key={i} className="flex-between activity-item">
                  <div className="flex-row gap-md" style={{ flex: 1 }}>
                    <div className={`icon-box icon-box-${item.typeClass}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted">{item.time}</div>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div className="flex-col gap-md">
            <Link href="/dashboard/notes" className="btn btn-primary btn-full flex-start">
              <BookOpen size={18} /> Summarize New Notes
            </Link>
            <Link href="/dashboard/mcq" className="btn btn-secondary btn-full flex-start">
              <Brain size={18} /> Generate Practice Test
            </Link>
            <Link href="/dashboard/planner" className="btn btn-secondary btn-full flex-start">
              <Calendar size={18} /> Update Study Plan
            </Link>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 className="nav-section-title" style={{ paddingLeft: 0, marginBottom: '0.75rem' }}>Today&apos;s Goal</h3>
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span className="font-semibold text-sm">Physics: Optics</span>
                <span className="text-xs text-primary font-medium">2h remaining</span>
              </div>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary)', height: '100%', width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
