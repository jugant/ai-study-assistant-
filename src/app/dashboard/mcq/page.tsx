"use client";

import { useState } from "react";
import { Brain, Settings2, Play, CheckCircle2, ChevronRight, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function MCQGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mcqs, setMcqs] = useState<{q: string, options: string[], correct: number, explanation: string}[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const [error, setError] = useState("");
  const { user } = useAuth();

  const generateMCQs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !user) return;
    setIsGenerating(true);
    setError("");
    setMcqs([]);
    setShowResults(false);
    setSelectedAnswers({});
    setCurrentQ(0);

    try {
      const res = await fetch("/api/generate/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count: 10 }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      
      setMcqs(data.mcqs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitTest = async () => {
    setShowResults(true);
    if (!user) return;
    try {
      const scoreValue = Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === mcqs[Number(k)].correct).length;
      await addDoc(collection(db, `users/${user.uid}/mcqs`), {
        topic,
        difficulty,
        score: scoreValue,
        total: mcqs.length,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to save score:", err);
    }
  };

  const handleSelect = (idx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ]: idx }));
  };

  const score = Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === mcqs[Number(k)].correct).length;

  return (
    <div className="flex-col gap-lg">
      <div className="page-header">
        <h1 className="text-3xl" style={{ marginBottom: '0.5rem' }}>AI MCQ Generator</h1>
        <p className="text-muted">Create custom practice tests aligned with JEE pattern instantly.</p>
      </div>

      {!mcqs.length ? (
        <div className="card text-center mx-auto animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '3rem', borderColor: 'var(--secondary)' }}>
          <div className="icon-box icon-box-lg icon-box-secondary mx-auto" style={{ width: '5rem', height: '5rem', marginBottom: '1.5rem' }}>
            <Brain size={40} />
          </div>
          <h2 className="text-2xl" style={{ marginBottom: '2rem' }}>Generate Practice Test</h2>
          
          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={generateMCQs} className="flex-col gap-md text-left">
            <div className="input-group">
              <label className="input-label">Topic or Chapter</label>
              <input 
                type="text" className="input" placeholder="e.g. Thermodynamics, Kinematics..."
                value={topic} onChange={e => setTopic(e.target.value)} required
              />
            </div>
            
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Difficulty Level</label>
                <div className="input-wrapper">
                  <Settings2 className="input-icon" size={18} />
                  <select className="select input-with-icon" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="easy">Easy (Mains 1)</option>
                    <option value="medium">Medium (Mains 2)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Questions</label>
                <select className="select">
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1rem' }} disabled={isGenerating}>
              {isGenerating ? "Generating..." : <><Play size={20} fill="currentColor" /> Start Practice</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="card flex-col animate-fade-in" style={{ minHeight: '650px', padding: '2.5rem' }}>
          <div className="flex-between" style={{ paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <h2 className="text-xl">{topic}</h2>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem', textTransform: 'uppercase' }}>{difficulty} LEVEL</span>
            </div>
            {!showResults ? (
              <div className="text-2xl font-bold text-primary">
                {currentQ + 1} <span className="text-lg text-muted font-normal">/ {mcqs.length}</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-success" style={{ background: 'var(--success-bg)', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                Score: {score} / {mcqs.length}
              </div>
            )}
          </div>

          <div className="flex-col" style={{ flex: 1 }}>
            <h3 className="text-xl font-medium" style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
              {mcqs[currentQ].q}
            </h3>

            <div className="flex-col gap-sm" style={{ marginBottom: '2rem' }}>
              {mcqs[currentQ].options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ] === idx;
                const isCorrect = mcqs[currentQ].correct === idx;
                
                let btnClass = "mcq-option";
                if (showResults) {
                  if (isCorrect) btnClass += " mcq-option-correct";
                  else if (isSelected) btnClass += " mcq-option-wrong";
                } else if (isSelected) {
                  btnClass += " mcq-option-selected";
                }

                return (
                  <button key={idx} className={btnClass} onClick={() => handleSelect(idx)} disabled={showResults}>
                    <span className="flex-row gap-md">
                      <span style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--muted)' }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                    {showResults && isCorrect && <CheckCircle2 size={24} className="text-success" />}
                    {showResults && isSelected && !isCorrect && <XCircle size={24} className="text-danger" />}
                  </button>
                )
              })}
            </div>

            {showResults && (
              <div className="animate-fade-in" style={{ padding: '1.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', fontSize: '0.9375rem', color: '#e2e8f0', marginBottom: '2rem' }}>
                <strong style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>Explanation:</strong>
                {mcqs[currentQ].explanation}
              </div>
            )}
            
            <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
               {showResults ? (
                  <>
                  <button className="btn btn-secondary" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
                    Previous
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentQ(Math.min(mcqs.length - 1, currentQ + 1))} disabled={currentQ === mcqs.length - 1}>
                    Next Question <ChevronRight size={18} />
                  </button>
                  </>
               ) : (
                  <>
                  <button className="btn btn-secondary" onClick={() => setMcqs([])}>Quit</button>
                  {currentQ < mcqs.length - 1 ? (
                    <button className="btn btn-primary" onClick={() => setCurrentQ(prev => prev + 1)}>
                      Next <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button className="btn btn-primary" style={{ background: 'var(--success)', boxShadow: '0 4px 15px -3px rgba(16,185,129,0.4)', color: 'white' }} onClick={submitTest}>
                      Submit Test
                    </button>
                  )}
                  </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
