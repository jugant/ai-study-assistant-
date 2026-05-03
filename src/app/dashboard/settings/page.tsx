"use client";

import { useState } from "react";
import { User, Bell, Shield, Moon, Sun, Monitor, Loader } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="flex-col gap-lg mx-auto" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>Settings</h1>
        <p className="text-muted">Manage your account settings and preferences.</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'minmax(200px, 1fr) 3fr' }}>
        <div className="flex-col gap-sm">
          <button className="sidebar-link active w-full text-left font-medium">
            <User size={18} /> Profile
          </button>
          <button className="sidebar-link w-full text-left font-medium">
            <Shield size={18} /> Account Security
          </button>
          <button className="sidebar-link w-full text-left font-medium">
            <Bell size={18} /> Notifications
          </button>
        </div>

        <div className="card">
          <form onSubmit={handleSave}>
            <h2 className="text-xl" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Profile Details</h2>
            
            <div className="flex-row gap-lg" style={{ marginBottom: '2.5rem' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                AK
              </div>
              <div>
                <h3 className="font-medium text-lg">Aryan Kumar</h3>
                <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>aryan@exam.com</p>
                <div className="badge badge-primary">PRO Plan</div>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="input" defaultValue="Aryan Kumar" />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" className="input" defaultValue="aryan@exam.com" disabled style={{ opacity: 0.5 }} />
              </div>
              <div className="input-group">
                <label className="input-label">Target Exam</label>
                <select className="select"><option>JEE Mains</option></select>
              </div>
              <div className="input-group">
                <label className="input-label">Target Year</label>
                <select className="select"><option>2026</option></select>
              </div>
            </div>

            <h2 className="text-xl" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>App Preferences</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Theme</label>
              <div className="flex-row gap-md">
                <button type="button" className="btn btn-secondary flex-center" style={{ flex: 1, padding: '1rem', background: 'rgba(139,92,246,0.1)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                  <Moon size={18} /> Dark
                </button>
                <button type="button" className="btn btn-secondary flex-center" style={{ flex: 1, padding: '1rem' }}>
                  <Sun size={18} /> Light
                </button>
                <button type="button" className="btn btn-secondary flex-center" style={{ flex: 1, padding: '1rem' }}>
                  <Monitor size={18} /> System
                </button>
              </div>
            </div>

            <div className="flex-row justify-end" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? <Loader size={20} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
