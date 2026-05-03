import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, Brain, Calendar, ChevronRight, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="w-full">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container animate-fade-in hero-content">
            <span className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>
              <Zap size={14} style={{ marginRight: '0.25rem' }} /> JEE Advanced 2026 Ready
            </span>
            <h1 className="text-5xl" style={{ marginBottom: '1.5rem' }}>
              Master Your Prep with <br />
              <span className="text-gradient">AI-Powered Intelligence</span>
            </h1>
            <p className="text-lg text-muted" style={{ marginBottom: '2.5rem' }}>
              Upload notes to generate instant summaries, craft custom MCQs on the fly, 
              and organize your rigorous study plans automatically. Built for smart JEE aspirants.
            </p>
            <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Start Studying Free <ChevronRight size={20} />
              </Link>
              <Link href="#features" className="btn btn-secondary btn-lg">
                View Features
              </Link>
            </div>
          </div>
        </section>

        {/* Platform Sneak Peek Demo Section */}
        <section className="feature-section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <h2 className="text-3xl" style={{ marginBottom: '1rem' }}>Inside the Platform</h2>
              <p className="text-lg text-muted">A production-ready environment designed entirely around focus and speed.</p>
            </div>
            
            <div className="card glass mx-auto p-4" style={{ maxWidth: '1000px', background: 'rgba(9, 9, 11, 0.6)', padding: '0.5rem' }}>
              <div className="w-full rounded-lg overflow-hidden relative" style={{ aspectRatio: '16/9', background: 'var(--background)', border: '1px solid var(--glass-border)' }}>
                 {/* Browser Mockup Topbar */}
                 <div className="flex-start gap-sm w-full" style={{ height: '2.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)', padding: '0 1rem' }}>
                   <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--danger)' }}></div>
                   <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--warning)' }}></div>
                   <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: 'var(--success)' }}></div>
                   <div style={{ margin: '0 auto', fontSize: '0.75rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 10rem', borderRadius: '0.25rem' }}>
                      study-orbit-app.com/dashboard
                   </div>
                 </div>

                 {/* Mockup Content */}
                 <div className="flex-row h-full">
                    {/* Mockup Sidebar */}
                    <div style={{ width: '200px', height: '100%', borderRight: '1px solid var(--glass-border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ height: '2rem', width: '80%', background: 'var(--primary)', opacity: 0.2, borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
                      <div style={{ height: '1.5rem', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}></div>
                      <div style={{ height: '1.5rem', width: '90%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}></div>
                      <div style={{ height: '1.5rem', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}></div>
                    </div>
                    {/* Mockup Main */}
                    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ height: '2.5rem', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}></div>
                      <div className="grid-3" style={{ gap: '1rem' }}>
                         <div style={{ height: '6rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}></div>
                         <div style={{ height: '6rem', borderRadius: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}></div>
                         <div style={{ height: '6rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}></div>
                      </div>
                      <div className="flex-row gap-lg" style={{ flex: 1, alignItems: 'stretch' }}>
                         <div style={{ flex: 2, borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ height: '1rem', width: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: '0.25rem' }}></div>
                            <div style={{ height: '1rem', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.25rem' }}></div>
                            <div style={{ height: '1rem', width: '90%', background: 'rgba(255,255,255,0.05)', borderRadius: '0.25rem' }}></div>
                         </div>
                         <div style={{ flex: 1, borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}></div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="feature-section" id="features" style={{ paddingTop: '2rem' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '4rem' }}>
              <h2 className="text-4xl" style={{ marginBottom: '1rem' }}>Everything you need to <span className="text-gradient">ace JEE</span></h2>
              <p className="text-lg text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                We&apos;ve combined the latest LLMs with proven study methodologies to create the ultimate productivity tool for your prep.
              </p>
            </div>

            <div className="grid-3">
              <div className="card text-center flex-col flex-center animate-fade-in delay-100">
                <div className="icon-box icon-box-lg icon-box-primary" style={{ marginBottom: '1.5rem' }}>
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl" style={{ marginBottom: '0.75rem' }}>Smart Summaries</h3>
                <p className="text-muted text-sm">
                  Upload dense PDFs or handwritten notes. Our AI instantly extracts the key concepts, formulas, and definitions.
                </p>
              </div>

              <div className="card text-center flex-col flex-center animate-fade-in delay-200">
                <div className="icon-box icon-box-lg icon-box-secondary" style={{ marginBottom: '1.5rem' }}>
                  <Brain size={32} />
                </div>
                <h3 className="text-xl" style={{ marginBottom: '0.75rem' }}>AI MCQ Generator</h3>
                <p className="text-muted text-sm">
                  Generate unlimited practice questions customized to chapter difficulty and your specific weak spots.
                </p>
              </div>

              <div className="card text-center flex-col flex-center animate-fade-in delay-300">
                <div className="icon-box icon-box-lg icon-box-success" style={{ marginBottom: '1.5rem' }}>
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl" style={{ marginBottom: '0.75rem' }}>Adaptive Study Planner</h3>
                <p className="text-muted text-sm">
                  Input your exam date and syllabus. Get a daily, optimized study schedule that adjusts as you progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '4rem' }}>
              <h2 className="text-4xl" style={{ marginBottom: '1rem' }}>Simple, <span className="text-gradient">Transparent Pricing</span></h2>
              <p className="text-lg text-muted">Start for free, upgrade when you need supercharged AI limits.</p>
            </div>

            <div className="grid-2 mx-auto" style={{ maxWidth: '800px' }}>
              {/* Free Tier */}
              <div className="card flex-col card-lg-padding animate-fade-in delay-100">
                <h3 className="text-2xl" style={{ marginBottom: '0.5rem' }}>Basic</h3>
                <div className="text-5xl font-bold" style={{ marginBottom: '1.5rem' }}>$0<span className="text-lg text-muted font-normal">/mo</span></div>
                <ul className="flex-col gap-sm text-muted" style={{ flex: '1', marginBottom: '2rem' }}>
                  <li className="flex-start gap-sm">✓ 10 Note summaries per month</li>
                  <li className="flex-start gap-sm">✓ 50 Generated MCQs</li>
                  <li className="flex-start gap-sm">✓ Basic study planner</li>
                </ul>
                <Link href="/signup" className="btn btn-secondary btn-full btn-lg mt-auto">Get Started</Link>
              </div>

              {/* Pro Tier */}
              <div className="card flex-col card-lg-padding animate-fade-in delay-200" style={{ borderColor: 'var(--primary)', boxShadow: 'var(--accent-glow)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                  POPULAR
                </div>
                <h3 className="text-2xl" style={{ marginBottom: '0.5rem' }}>Pro Aspirant</h3>
                <div className="text-5xl font-bold" style={{ marginBottom: '1.5rem' }}>$9<span className="text-lg text-muted font-normal">/mo</span></div>
                <ul className="flex-col gap-sm" style={{ flex: '1', marginBottom: '2rem' }}>
                  <li className="flex-start gap-sm">✓ Unlimited Note Summaries</li>
                  <li className="flex-start gap-sm">✓ Unlimited Custom MCQs</li>
                  <li className="flex-start gap-sm">✓ Advanced adaptive planner</li>
                  <li className="flex-start gap-sm">✓ Priority AI processing</li>
                </ul>
                <Link href="/signup" className="btn btn-primary btn-full btn-lg mt-auto">Upgrade to Pro</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
