'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'

interface StockData {
  symbol: string
  name: string
  sector: string
  price: number
  change_percent: number
  volume: number
}

interface MacroData {
  indicator_name: string
  value: number
  unit: string
  period: string
  source: string
}

interface AIInsight {
  sector: string
  summary: string
  risk_level: string
}

interface ChatMessage {
  role: string
  content: string
}

interface CompanyAnalysis {
  company: string
  sector: string
  healthScore: number
  riskLevel: string
  strengths: string[]
  risks: string[]
  outlook: string
  recommendation: string
}

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [macro, setMacro] = useState<MacroData[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  const [lang, setLang] = useState<'EN' | 'HU'>('EN')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [companyInput, setCompanyInput] = useState('')
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysis | null>(null)

  const t = {
    EN: {
      title: 'HU-Market Intelligence',
      subtitle: 'AI-powered financial analytics for the Hungarian market',
      refresh: 'Refresh Market Data',
      generateAI: 'Generate AI Insights',
      exportPDF: 'Export PDF Report',
      generating: 'Generating...',
      loading: 'Loading...',
      bet: 'Budapest Stock Exchange (BÉT)',
      macro: 'NBH Macro Indicators',
      ai: 'AI Sector Risk Analysis',
      chat: 'Ask the AI Analyst',
      chatPlaceholder: 'Ask about the Hungarian market...',
      chatHint: 'e.g. "What is the risk for OTP Bank right now?" or "How does inflation affect Hungarian SMEs?"',
      thinking: 'Analyst is thinking...',
      send: 'Send',
      updated: 'Last updated',
      volume: 'Vol',
      company: 'Company Financial Health Checker',
      companySubtitle: 'Type any Hungarian company name and AI will analyse its financial health',
      companyPlaceholder: 'e.g. OTP Bank, MOL, Richter, Wizz Air, Lidl Hungary...',
      analyse: 'Analyse',
      analysing: 'Analysing...',
      strengths: 'Strengths',
      risks: 'Risks',
      outlook: 'Market Outlook',
      healthScore: 'Health Score',
    },
    HU: {
      title: 'Magyar Piaci Intelligencia',
      subtitle: 'MI-alapú pénzügyi elemzés a magyar piacra',
      refresh: 'Piaci adatok frissítése',
      generateAI: 'MI elemzés generálása',
      exportPDF: 'PDF jelentés exportálása',
      generating: 'Generálás...',
      loading: 'Betöltés...',
      bet: 'Budapesti Értéktőzsde (BÉT)',
      macro: 'MNB Makromutatók',
      ai: 'MI Szektorkockázat Elemzés',
      chat: 'Kérdezd az MI elemzőt',
      chatPlaceholder: 'Kérdezz a magyar piacról...',
      chatHint: 'pl. "Mekkora kockázatot jelent az OTP Bank most?"',
      thinking: 'Az elemző gondolkodik...',
      send: 'Küldés',
      updated: 'Utoljára frissítve',
      volume: 'Forgalom',
      company: 'Vállalati Pénzügyi Egészség Ellenőrző',
      companySubtitle: 'Írj be bármely magyar vállalat nevét és az MI elemzi a pénzügyi helyzetét',
      companyPlaceholder: 'pl. OTP Bank, MOL, Richter, Wizz Air...',
      analyse: 'Elemzés',
      analysing: 'Elemzés folyamatban...',
      strengths: 'Erősségek',
      risks: 'Kockázatok',
      outlook: 'Piaci Kilátások',
      healthScore: 'Egészségi Pontszám',
    }
  }[lang]

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [marketRes, macroRes] = await Promise.all([
      fetch('/api/market'),
      fetch('/api/macro'),
    ])
    const marketJson = await marketRes.json()
    const macroJson = await macroRes.json()
    setStocks(marketJson.data || [])
    setMacro(macroJson.data || [])
    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }

  async function fetchAIInsights() {
    setAiLoading(true)
    const res = await fetch('/api/ai')
    const json = await res.json()
    setInsights(json.data || [])
    setAiLoading(false)
  }

  async function analyseCompany() {
    if (!companyInput.trim()) return
    setCompanyLoading(true)
    setCompanyAnalysis(null)
    const res = await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company: companyInput.trim() })
    })
    const json = await res.json()
    setCompanyAnalysis(json.data)
    setCompanyLoading(false)
  }

  async function sendMessage() {
    if (!chatInput.trim()) return
    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    })
    const json = await res.json()
    setChatMessages(prev => [...prev, { role: 'assistant', content: json.response || 'Sorry, I could not get a response.' }])
    setChatLoading(false)
  }

  async function exportPDF() {
    const doc = new jsPDF()
    const now = new Date().toLocaleString()

    doc.setFillColor(10, 10, 10)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('HU-Market Intelligence Report', 14, 18)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${now}`, 14, 28)
    doc.text('Powered by Groq AI | Data: NBH / KSH / BET', 14, 35)

    let y = 50

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('NBH Macro Indicators', 14, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    macro.forEach((m) => {
      doc.setFillColor(245, 245, 245)
      doc.rect(14, y, 182, 10, 'F')
      doc.setTextColor(50, 50, 50)
      doc.text(m.indicator_name, 18, y + 7)
      doc.setFont('helvetica', 'bold')
      doc.text(`${m.value}${m.unit === '%' ? '%' : ' ' + m.unit}`, 140, y + 7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(150, 150, 150)
      doc.text(`${m.period} · ${m.source}`, 170, y + 7)
      y += 12
    })

    y += 8

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Budapest Stock Exchange (BET)', 14, y)
    y += 8

    doc.setFontSize(10)
    stocks.forEach((stock) => {
      doc.setFillColor(245, 245, 245)
      doc.rect(14, y, 182, 10, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(stock.symbol, 18, y + 7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 80)
      doc.text(stock.name, 45, y + 7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(`${stock.price.toLocaleString()} HUF`, 130, y + 7)
      const changeColor = stock.change_percent >= 0 ? [34, 197, 94] as const : [239, 68, 68] as const
      doc.setTextColor(changeColor[0], changeColor[1], changeColor[2])
      doc.text(`${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent}%`, 175, y + 7)
      y += 12
    })

    y += 8

    if (insights.length > 0) {
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Sector Risk Analysis', 14, y)
      y += 8

      insights.forEach((insight) => {
        if (y > 250) { doc.addPage(); y = 20 }
        const riskRgb = insight.risk_level === 'HIGH' ? [239, 68, 68] as const : insight.risk_level === 'LOW' ? [34, 197, 94] as const : [245, 158, 11] as const
        doc.setFillColor(245, 245, 245)
        doc.rect(14, y, 182, 8, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 30)
        doc.text(insight.sector, 18, y + 6)
        doc.setTextColor(riskRgb[0], riskRgb[1], riskRgb[2])
        doc.text(insight.risk_level, 170, y + 6)
        y += 10
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.setFontSize(9)
        const lines = doc.splitTextToSize(insight.summary, 178)
        doc.text(lines, 18, y)
        y += lines.length * 5 + 6
        doc.setFontSize(10)
      })
    }

    doc.setFillColor(10, 10, 10)
    doc.rect(0, 282, 210, 15, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.text('HU-Market Intelligence Platform | Built with Next.js, Groq AI, Supabase', 14, 290)
    doc.text('Page 1', 190, 290)

    doc.save(`HU-Market-Report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const riskColor = (level: string) => {
    if (level === 'HIGH') return '#ef4444'
    if (level === 'LOW') return '#22c55e'
    return '#f59e0b'
  }

  const chartData = stocks.map(s => ({
    name: s.symbol,
    price: s.price,
    change: s.change_percent,
  }))

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 6px' }}>🇭🇺 {t.title}</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>{t.subtitle}</p>
          {lastUpdated && <p style={{ color: '#555', margin: '4px 0 0', fontSize: '12px' }}>{t.updated}: {lastUpdated}</p>}
        </div>
        <button
          onClick={() => setLang(lang === 'EN' ? 'HU' : 'EN')}
          style={{ background: '#1a1a1a', color: '#fff', border: '0.5px solid #333', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}
        >
          {lang === 'EN' ? '🇭🇺 Magyar' : '🇬🇧 English'}
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={fetchAll} style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}>
          {loading ? t.loading : t.refresh}
        </button>
        <button onClick={fetchAIInsights} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}>
          {aiLoading ? t.generating : t.generateAI}
        </button>
        <button onClick={exportPDF} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}>
          {t.exportPDF}
        </button>
      </div>

      {/* Macro Indicators */}
      {macro.length > 0 && (
        <>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>{t.macro}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {macro.map((m) => (
              <div key={m.indicator_name} style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ color: '#888', fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.indicator_name}</p>
                <p style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px' }}>{m.value}{m.unit === '%' ? '%' : ''}</p>
                {m.unit !== '%' && <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>{m.unit}</p>}
                <p style={{ color: '#555', fontSize: '11px', margin: 0 }}>{m.period} · {m.source}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Stock Cards */}
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>{t.bet}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stocks.map((stock) => (
          <div key={stock.symbol} style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>{stock.symbol}</span>
              <span style={{ color: stock.change_percent >= 0 ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent}%
              </span>
            </div>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px' }}>{stock.name}</p>
            <p style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px' }}>{stock.price.toLocaleString()} HUF</p>
            <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>{t.volume}: {stock.volume.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      {stocks.length > 0 && (
        <>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>Daily Change (%) — All Stocks</h2>
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '0.5px solid #333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Change']}
                />
                <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.change >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>{t.ai}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {insights.map((insight) => (
              <div key={insight.sector} style={{ background: '#111', border: `0.5px solid ${riskColor(insight.risk_level)}44`, borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '600' }}>{insight.sector}</span>
                  <span style={{ background: riskColor(insight.risk_level) + '22', color: riskColor(insight.risk_level), fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                    {insight.risk_level}
                  </span>
                </div>
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{insight.summary}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Company Health Checker */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '6px' }}> {t.company}</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem' }}>{t.companySubtitle}</p>
        <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyseCompany()}
              placeholder={t.companyPlaceholder}
              style={{ flex: 1, background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={analyseCompany}
              disabled={companyLoading || !companyInput.trim()}
              style={{ background: '#0891b2', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', opacity: companyLoading || !companyInput.trim() ? 0.5 : 1 }}
            >
              {companyLoading ? t.analysing : t.analyse}
            </button>
          </div>

          {companyAnalysis && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px' }}>{companyAnalysis.company}</p>
                  <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{companyAnalysis.sector}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: companyAnalysis.healthScore >= 70 ? '#22c55e' : companyAnalysis.healthScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {companyAnalysis.healthScore}
                    </p>
                    <p style={{ color: '#888', fontSize: '11px', margin: 0 }}>{t.healthScore}</p>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ background: riskColor(companyAnalysis.riskLevel) + '22', color: riskColor(companyAnalysis.riskLevel), fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px' }}>
                      {companyAnalysis.riskLevel}
                    </span>
                    <span style={{ background: companyAnalysis.recommendation === 'BUY' ? '#22c55e22' : companyAnalysis.recommendation === 'AVOID' ? '#ef444422' : '#f59e0b22', color: companyAnalysis.recommendation === 'BUY' ? '#22c55e' : companyAnalysis.recommendation === 'AVOID' ? '#ef4444' : '#f59e0b', fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px' }}>
                      {companyAnalysis.recommendation}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#1a1a1a', borderRadius: '8px', height: '8px', marginBottom: '1.5rem' }}>
                <div style={{ height: '8px', borderRadius: '8px', width: `${companyAnalysis.healthScore}%`, background: companyAnalysis.healthScore >= 70 ? '#22c55e' : companyAnalysis.healthScore >= 40 ? '#f59e0b' : '#ef4444' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#0a1a0a', border: '0.5px solid #22c55e33', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>✓ {t.strengths}</p>
                  {companyAnalysis.strengths.map((s, i) => (
                    <p key={i} style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>• {s}</p>
                  ))}
                </div>
                <div style={{ background: '#1a0a0a', border: '0.5px solid #ef444433', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>✗ {t.risks}</p>
                  {companyAnalysis.risks.map((r, i) => (
                    <p key={i} style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>• {r}</p>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0a0a1a', border: '0.5px solid #1d4ed833', borderRadius: '10px', padding: '1rem' }}>
                <p style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '600', margin: '0 0 6px' }}>📈 {t.outlook}</p>
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{companyAnalysis.outlook}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}> {t.chat}</h2>
      <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
          {chatMessages.length === 0 && (
            <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', paddingTop: '4rem' }}>
              {t.chatPlaceholder}<br />
              <span style={{ fontSize: '12px', color: '#444', marginTop: '8px', display: 'block' }}>{t.chatHint}</span>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', background: msg.role === 'user' ? '#1d4ed8' : '#1a1a1a', border: msg.role === 'assistant' ? '0.5px solid #333' : 'none', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', lineHeight: '1.6', color: '#fff' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ color: '#555', fontSize: '13px', fontStyle: 'italic' }}>{t.thinking}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t.chatPlaceholder}
            style={{ flex: 1, background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={chatLoading || !chatInput.trim()}
            style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', opacity: chatLoading || !chatInput.trim() ? 0.5 : 1 }}
          >
            {t.send}
          </button>
        </div>
      </div>

    </main>
  )
}