"use client";

import { useState } from "react";
import { Upload, FileText, Sparkles, Loader, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NotesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "text" | "url">("upload");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!textInput && !file) return;
    setIsGenerating(true);
    setSummary(null);
    setError("");

    try {
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput || file?.name || "Dummy content" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");
      
      setSummary(data.summary);
      
      if (user) {
        await addDoc(collection(db, `users/${user.uid}/notes`), {
          content: textInput.substring(0, 50) + "...",
          summary: data.summary,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-col gap-lg">
      <div className="page-header">
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>AI Notes Summarizer</h1>
        <p className="text-muted">Transform your dense JEE notes into concise, actionable summaries.</p>
      </div>

      <div className="grid-2">
        {/* Input Section */}
        <div className="card flex-col">
          <div className="flex-row" style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
            {(["upload", "text", "url"] as const).map((tab) => (
              <button 
                key={tab}
                style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--muted)', borderColor: activeTab === tab ? 'var(--primary)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "url" ? "Web Link" : tab === "upload" ? "Upload PDF" : "Paste Text"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, marginBottom: '1.5rem' }}>
            {activeTab === "upload" && (
              <div 
                className="upload-area"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input id="file-upload" type="file" style={{ display: 'none' }} accept=".pdf,.txt,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <div className="icon-box icon-box-lg icon-box-primary" style={{ marginBottom: '1rem' }}>
                  <Upload size={32} />
                </div>
                <h3 className="font-semibold text-lg" style={{ marginBottom: '0.25rem' }}>Click to upload or drag & drop</h3>
                <p className="text-sm text-muted">PDF, TXT, or Word files (Max 10MB)</p>
                {file && (
                  <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500 }}>
                    <FileText size={16} style={{ marginRight: '0.5rem' }} />
                    {file.name}
                  </div>
                )}
              </div>
            )}

            {activeTab === "text" && (
              <textarea 
                className="textarea" 
                style={{ height: '100%', minHeight: '250px' }}
                placeholder="Paste your notes text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              ></textarea>
            )}

            {activeTab === "url" && (
              <div className="input-group">
                <label className="input-label">Article or Page URL</label>
                <div className="input-wrapper">
                  <LinkIcon className="input-icon" size={18} />
                  <input type="url" placeholder="https://example.com/notes" className="input input-with-icon" />
                </div>
                <p className="text-xs text-muted flex-row mt-2" style={{ marginTop: '0.5rem' }}>
                  <AlertCircle size={12} style={{ marginRight: '0.25rem' }} /> Ensure the link is publicly accessible.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button 
            className="btn btn-primary btn-full btn-lg mt-auto"
            onClick={handleGenerate}
            disabled={isGenerating || (activeTab === "upload" && !file) || (activeTab === "text" && !textInput)}
          >
            {isGenerating ? <><Loader size={20} className="animate-spin" /> Analyzing Content...</> : <><Sparkles size={20} /> Generate Smart Summary</>}
          </button>
        </div>

        {/* Output Section */}
        <div className="card flex-col" style={{ background: 'rgba(9, 9, 11, 0.8)', padding: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h2 className="text-xl flex-row gap-sm"><Sparkles className="text-primary" size={20} /> AI Output</h2>
            {summary && <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.75rem' }}>Copy</button>}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {!summary && !isGenerating && (
              <div className="flex-col flex-center text-muted h-full" style={{ minHeight: '250px', textAlign: 'center' }}>
                <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Upload your notes and let our AI create<br/>a structured summary tailored for JEE.</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex-col flex-center text-center h-full animate-fade-in" style={{ minHeight: '250px' }}>
                <div className="icon-box icon-box-lg icon-box-primary animate-pulse-glow" style={{ marginBottom: '1rem' }}>
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-bold" style={{ marginBottom: '0.5rem' }}>Synthesizing Notes</h3>
                <p className="text-sm text-muted" style={{ maxWidth: '300px' }}>
                  Our JEE model is extracting key formulas and structuring concepts...
                </p>
                <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1.5rem', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', background: 'var(--primary)', animation: 'float 1.5s ease-in-out infinite alternate', borderRadius: '2px' }}></div>
                </div>
              </div>
            )}

            {summary && (
              <div className="animate-fade-in text-sm" style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                <h3 className="text-lg font-bold" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Smart Summary</h3>
                <div className="flex-col gap-md">
                   {summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
