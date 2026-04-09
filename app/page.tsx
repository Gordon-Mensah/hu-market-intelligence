'use client'
import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 3rem', borderBottom: '0.5px solid #1a1a1a', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100 }}>
        <span style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px', color: '#fff' }}>HU-Market Intelligence</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '8px 16px' }}
          >
            Dashboard       
          </button>
          
           <a href="https://github.com/Gordon-Mensah/hu-market-intelligence"
            target="_blank"
            style={{ background: 'transparent', color: '#666', border: '0.5px solid #333', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' }}
          >
            GitHub
          </a>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: '#fff', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            Open Platform
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '8rem 2rem 5rem', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#111', color: '#888', fontSize: '12px', fontWeight: '500', padding: '6px 16px', borderRadius: '4px', marginBottom: '2rem', border: '0.5px solid #222', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          AI-Powered Financial Intelligence — Hungary
        </div>
        <h1 style={{ fontSize: '58px', fontWeight: '700', lineHeight: '1.1', margin: '0 0 1.5rem', letterSpacing: '-2px', color: '#fff' }}>
          Market intelligence<br />built for Hungary.
        </h1>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', margin: '0 auto 3rem', maxWidth: '580px' }}>
          Real-time Budapest Stock Exchange data, National Bank of Hungary macro indicators, AI-powered sector risk analysis, and company financial health scoring — in one platform.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: '#fff', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '14px 32px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', letterSpacing: '-0.2px' }}
          >
            Open Platform
          </button>
          
           <a href="https://github.com/Gordon-Mensah/hu-market-intelligence"
            target="_blank"
            style={{ background: 'transparent', color: '#fff', border: '0.5px solid #333', borderRadius: '8px', padding: '14px 32px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}
          >
            View Source
          </a>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '0.5px solid #1a1a1a' }} />

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', borderBottom: '0.5px solid #1a1a1a' }}>
        {[
          { value: '6', label: 'BET Stocks Tracked' },
          { value: '6', label: 'NBH Macro Indicators' },
          { value: '5', label: 'AI Sector Analyses' },
          { value: 'Live', label: 'Data Refresh' },
        ].map((stat, i) => (
          <div key={stat.label} style={{ padding: '3rem 2rem', textAlign: 'center', borderRight: i < 3 ? '0.5px solid #1a1a1a' : 'none' }}>
            <p style={{ fontSize: '44px', fontWeight: '700', margin: '0 0 8px', color: '#fff', letterSpacing: '-2px' }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#555', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem' }}>Capabilities</p>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: 0, letterSpacing: '-1px' }}>
            Built for analysts, investors,<br />and Hungarian businesses.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0px', border: '0.5px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          {[
            {
              title: 'Live BET Market Data',
              desc: 'Track OTP Bank, MOL, Richter Gedeon, Magyar Telekom, Opus Global and Autowallis — all priced in HUF with real-time percentage changes and volume data.',
            },
            {
              title: 'NBH Macro Indicators',
              desc: 'Monitor base interest rates, CPI inflation, GDP growth, EUR/HUF exchange rates, unemployment and public debt sourced from official NBH and KSH publications.',
            },
            {
              title: 'AI Sector Risk Analysis',
              desc: 'Groq LLaMA 70B generates sector-specific risk summaries for Banking, Energy, Pharma, Telecom and Automotive — calibrated to Hungarian market conditions.',
            },
            {
              title: 'AI Market Chat Interface',
              desc: 'Query the platform in plain language. Receive senior analyst-level responses on any aspect of the Hungarian financial market, instantly.',
            },
            {
              title: 'Company Health Scoring',
              desc: 'Input any Hungarian company name and receive a quantified health score, risk classification, BUY/HOLD/AVOID rating, and a structured strengths and risks breakdown.',
            },
            {
              title: 'PDF Report Generation',
              desc: 'Export a fully formatted financial intelligence briefing in one click. Includes macro data, stock prices, and AI sector analysis — ready for client or board distribution.',
            },
          ].map((feature, i) => (
            <div key={feature.title} style={{
              padding: '2rem',
              borderRight: i % 2 === 0 ? '0.5px solid #1a1a1a' : 'none',
              borderBottom: i < 4 ? '0.5px solid #1a1a1a' : 'none',
              background: '#0a0a0a'
            }}>
              <div style={{ width: '28px', height: '2px', background: '#1d4ed8', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 10px', color: '#fff' }}>{feature.title}</h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '0.5px solid #1a1a1a' }} />

      {/* Tech Stack */}
      <section style={{ padding: '4rem 3rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Technology Stack</p>
          <p style={{ color: '#fff', fontSize: '15px', margin: 0, fontWeight: '500' }}>Built on modern, production-grade infrastructure.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Next.js 14', 'TypeScript', 'Groq LLaMA 70B', 'Supabase', 'Recharts', 'jsPDF', 'Vercel'].map((tech) => (
            <span key={tech} style={{ background: '#111', border: '0.5px solid #222', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', color: '#888', letterSpacing: '0.3px' }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '0.5px solid #1a1a1a' }} />

      {/* Who It's For */}
      <section style={{ padding: '6rem 3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem' }}>Use Cases</p>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: 0, letterSpacing: '-1px' }}>Who uses this platform.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Financial Analysts', desc: 'Access structured Hungarian market data and AI-generated sector summaries without expensive terminal subscriptions.' },
            { title: 'SME Owners', desc: 'Understand the macroeconomic environment affecting your business — interest rates, inflation, sector risk — in plain language.' },
            { title: 'Investors', desc: 'Screen Hungarian companies and sectors before making capital allocation decisions, backed by AI analysis.' },
            { title: 'Consultants', desc: 'Generate branded PDF financial briefings for clients in seconds, covering the full Hungarian market landscape.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: '10px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 10px', color: '#fff' }}>{item.title}</h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', borderTop: '0.5px solid #1a1a1a', borderBottom: '0.5px solid #1a1a1a' }}>
        <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1.5rem' }}>Get Started</p>
        <h2 style={{ fontSize: '42px', fontWeight: '700', margin: '0 0 1rem', letterSpacing: '-1.5px' }}>
          Start analysing the Hungarian market.
        </h2>
        <p style={{ color: '#555', fontSize: '16px', margin: '0 0 2.5rem' }}>Free. No registration required. Available in English and Hungarian.</p>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: '#fff', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '16px 40px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', letterSpacing: '-0.2px' }}
        >
          Open Platform
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ color: '#444', fontSize: '13px' }}>HU-Market Intelligence — Built by John Jerry Gordon-Mensah</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="https://github.com/Gordon-Mensah/hu-market-intelligence" target="_blank" style={{ color: '#444', fontSize: '13px', textDecoration: 'none' }}>GitHub</a>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#444', fontSize: '13px', cursor: 'pointer', padding: 0 }}>Dashboard</button>
        </div>
      </footer>

    </main>
  )
}