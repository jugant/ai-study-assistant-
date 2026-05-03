"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Target, CheckCircle2, Circle, Flag, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function PlannerPage() {
  const [examDate, setExamDate] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [hours, setHours] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examDate, focusArea, hours }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      
      setTasks(data.tasks);
      setPlanGenerated(true);

      await addDoc(collection(db, `users/${user.uid}/plans`), {
        examDate,
        focusArea,
        hours,
        tasks: data.tasks,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-col gap-lg">
      <div className="page-header">
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>Adaptive Study Planner</h1>
        <p className="text-muted">Generate a structured daily schedule based on your target date.</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card flex-col" style={{ height: 'fit-content' }}>
          <h2 className="text-xl" style={{ marginBottom: '1.5rem' }}>Create New Plan</h2>
          <form onSubmit={generatePlan} className="flex-col gap-md">
            <div className="input-group">
              <label className="input-label">Target Exam Date</label>
              <div className="input-wrapper">
                <CalendarIcon className="input-icon" size={18} />
                <input type="date" className="input input-with-icon" min={todayDate} required value={examDate} onChange={e => setExamDate(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Syllabus Focus</label>
              <textarea className="textarea" style={{ minHeight: '100px' }} placeholder="e.g. Need to complete Mechanics..." value={focusArea} onChange={e => setFocusArea(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Daily Available Hours</label>
              <div className="input-wrapper">
                <Clock className="input-icon" size={18} />
                <select className="select input-with-icon" value={hours} onChange={e => setHours(e.target.value)}>
                  <option value="4">4 Hours</option><option value="6">6 Hours</option><option value="8">8 Hours</option>
                </select>
              </div>
            </div>
            
            {error && (
              <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={isGenerating}>
              {isGenerating ? "Analyzing..." : "Generate Schedule"}
            </button>
          </form>
        </div>

        <div>
          {!planGenerated && !isGenerating ? (
            <div className="card flex-col flex-center text-center text-muted" style={{ minHeight: '400px' }}>
              <CalendarIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Enter your target details to<br/>generate a smart study plan.</h3>
            </div>
          ) : isGenerating ? (
            <div className="card flex-col flex-center text-center" style={{ minHeight: '400px' }}>
              <div className="icon-box icon-box-lg icon-box-success animate-spin-slow" style={{ marginBottom: '1rem' }}>
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold">Optimizing Timeline</h3>
              <p className="text-sm text-muted">Calculating daily targets...</p>
            </div>
          ) : (
            <div className="flex-col gap-lg animate-fade-in">
              <div className="card flex-row gap-lg" style={{ borderLeft: '4px solid var(--success)', padding: '1.25rem' }}>
                <div className="icon-box icon-box-success"><Flag size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg">Goal: JEE Mains (Target: {examDate})</h3>
                  <p className="text-sm text-muted">Estimated completion: 15 days before the exam</p>
                </div>
              </div>

              <div>
                <h3 className="nav-section-title" style={{ paddingLeft: 0, marginBottom: '1rem' }}>Today&apos;s Schedule</h3>
                <div className="flex-col gap-sm">
                  {tasks.map((task, i) => (
                    <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: task.done ? 0.6 : 1 }}>
                      <button onClick={() => toggleTask(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.1rem', color: task.done ? 'var(--success)' : 'var(--muted)' }}>
                        {task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                          <h4 className="font-bold" style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--muted)' : 'inherited' }}>
                            {task.sub}: {task.topic}
                          </h4>
                          <span className={`badge ${task.timeClass}`}>{task.dur}</span>
                        </div>
                        <p className="text-sm text-muted" style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
