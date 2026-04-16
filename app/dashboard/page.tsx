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

interface PortfolioItem {
  symbol: string
  name: string
  percentage: number
  amount: number
  sector: string
}

interface PortfolioAnalysis {
  overallRisk: string
  diversificationScore: number
  sectorExposure: { sector: string; percentage: number; risk: string }[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  suggestedChanges?: {
    increase: string[]
    decrease: string[]
    remove: string[]
    add: string[]
  }
  summary: string
}

interface User {
  id: string
  email: string
}

interface WatchlistItem {
  id: string
  symbol: string
  name: string
  sector: string
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
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { symbol: 'OTP', name: 'OTP Bank Nyrt.', percentage: 30, amount: 0, sector: 'Banking' },
    { symbol: 'MOL', name: 'MOL Magyar Olaj', percentage: 25, amount: 0, sector: 'Energy' },
    { symbol: 'RICHTER', name: 'Richter Gedeon', percentage: 20, amount: 0, sector: 'Pharma' },
    { symbol: 'MTELEKOM', name: 'Magyar Telekom', percentage: 15, amount: 0, sector: 'Telecom' },
    { symbol: 'OPUS', name: 'Opus Global', percentage: 5, amount: 0, sector: 'Investment' },
    { symbol: 'AUTOWALLIS', name: 'Autowallis Nyrt.', percentage: 5, amount: 0, sector: 'Automotive' },
  ])
  const [totalCapital, setTotalCapital] = useState<number>(1000000)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [customStockSymbol, setCustomStockSymbol] = useState('')
  const [customStockName, setCustomStockName] = useState('')
  const [customStockSector, setCustomStockSector] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authMessage, setAuthMessage] = useState('')
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

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
      portfolio: 'Portfolio Diversification Planner',
      portfolioSubtitle: 'Allocate your capital across BET stocks and get AI-powered diversification analysis',
      capitalLabel: 'Total Capital (HUF)',
      allocation: 'Allocation',
      analysePortfolio: 'Analyse Portfolio',
      analysingPortfolio: 'Analysing Portfolio...',
      diversificationScore: 'Diversification Score',
      overallRisk: 'Overall Risk',
      sectorExposure: 'Sector Exposure',
      weaknesses: 'Weaknesses',
      recommendations: 'AI Recommendations',
      summary: 'Summary',
      addStock: 'Add Custom Stock',
      stockSymbol: 'Stock Symbol',
      stockName: 'Company Name',
      stockSector: 'Sector',
      add: 'Add',
      remove: 'Remove',
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
      portfolio: 'Portfólió Diverzifikációs Tervező',
      portfolioSubtitle: 'Ossza el tőkéjét a BÉT részvények között és kapjon MI-alapú diverzifikációs analízist',
      capitalLabel: 'Teljes Tőke (HUF)',
      allocation: 'Allokáció',
      analysePortfolio: 'Portfólió Elemzése',
      analysingPortfolio: 'Portfólió elemzése folyamatban...',
      diversificationScore: 'Diverzifikációs Pontszám',
      overallRisk: 'Összesített Kockázat',
      sectorExposure: 'Szektori Kitettség',
      weaknesses: 'Gyengeségek',
      recommendations: 'MI Ajánlások',
      summary: 'Összefoglalás',
      addStock: 'Egyéni Részvény Hozzáadása',
      stockSymbol: 'Részvénytörténet',
      stockName: 'Vállalat Neve',
      stockSector: 'Szektor',
      add: 'Hozzáadás',
      remove: 'Eltávolítás',
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

  async function analysePortfolio() {
    setPortfolioLoading(true)
    setPortfolioAnalysis(null)
    const portfolioWithAmounts = portfolio.map(p => ({
      ...p,
      amount: Math.round((p.percentage / 100) * totalCapital)
    }))
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio: portfolioWithAmounts, language: lang })
    })
    const json = await res.json()
    setPortfolioAnalysis(json.data)
    setPortfolioLoading(false)
  }

  function addCustomStock() {
    if (!customStockSymbol.trim() || !customStockName.trim() || !customStockSector.trim()) return
    setPortfolio(prev => [
      ...prev,
      { symbol: customStockSymbol, name: customStockName, percentage: 0, amount: 0, sector: customStockSector }
    ])
    setCustomStockSymbol('')
    setCustomStockName('')
    setCustomStockSector('')
  }

  function removeStock(symbol: string) {
    setPortfolio(prev => prev.filter(p => p.symbol !== symbol))
  }

  function updatePercentage(symbol: string, value: number) {
    setPortfolio(prev => prev.map(p =>
      p.symbol === symbol ? { ...p, percentage: value } : p
    ))
  }

  const totalPercentage = portfolio.reduce((sum, p) => sum + p.percentage, 0)

  async function handleAuth() {
    setAuthLoading(true)
    setAuthMessage('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword, action: authMode })
    })
    const json = await res.json()
    if (json.success) {
      if (authMode === 'signup') {
        setAuthMessage('Account created! Please check your email to confirm.')
      } else {
        setUser({ id: json.data.user.id, email: json.data.user.email })
        fetchWatchlist(json.data.user.id)
      }
    } else {
      setAuthMessage(json.error || 'Something went wrong')
    }
    setAuthLoading(false)
  }

  async function handleLogout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })
    setUser(null)
    setWatchlist([])
  }

  async function fetchWatchlist(userId: string) {
    const res = await fetch(`/api/watchlist?user_id=${userId}`)
    const json = await res.json()
    setWatchlist(json.data || [])
  }

  async function addToWatchlist(stock: StockData) {
    if (!user) return
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, symbol: stock.symbol, name: stock.name, sector: stock.sector })
    })
    const json = await res.json()
    if (json.success) fetchWatchlist(user.id)
  }

  async function removeFromWatchlist(id: string) {
    await fetch('/api/watchlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (user) fetchWatchlist(user.id)
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

  const isInWatchlist = (symbol: string) => watchlist.some(w => w.symbol === symbol)

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
            <p style={{ color: '#555', fontSize: '12px', margin: '0 0 8px' }}>{t.volume}: {stock.volume.toLocaleString()}</p>
            {user && (
              <button
                onClick={() => isInWatchlist(stock.symbol) ? removeFromWatchlist(watchlist.find(w => w.symbol === stock.symbol)!.id) : addToWatchlist(stock)}
                style={{ background: isInWatchlist(stock.symbol) ? '#1a1a1a' : '#1d4ed822', color: isInWatchlist(stock.symbol) ? '#666' : '#60a5fa', border: `0.5px solid ${isInWatchlist(stock.symbol) ? '#333' : '#1d4ed844'}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', width: '100%' }}
              >
                {isInWatchlist(stock.symbol) ? 'Remove from Watchlist' : '+ Add to Watchlist'}
              </button>
            )}
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

      {/* Portfolio Planner */}
      <div style={{ marginBottom: '2rem', marginTop: '4rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '6px' }}>
          {t.portfolio}
        </h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem' }}>
          {t.portfolioSubtitle}
        </p>
        <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.5rem' }}>

          {/* Capital Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              {t.capitalLabel}
            </label>
            <input
              type="number"
              value={totalCapital}
              onChange={(e) => setTotalCapital(parseInt(e.target.value) || 0)}
              style={{ background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none', width: '200px' }}
            />
          </div>

          {/* Allocation Sliders */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#888', fontSize: '13px' }}>{t.allocation}</span>
              <span style={{ color: totalPercentage === 100 ? '#22c55e' : '#ef4444', fontSize: '13px', fontWeight: '600' }}>
                Total: {totalPercentage}% {totalPercentage !== 100 ? '(must equal 100%)' : ''}
              </span>
            </div>
            {portfolio.map((item) => (
              <div key={item.symbol} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.symbol}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                      {Math.round((item.percentage / 100) * totalCapital).toLocaleString()} HUF
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={item.percentage}
                    onChange={(e) => updatePercentage(item.symbol, parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#1d4ed8' }}
                  />
                  <div style={{ width: '120px', background: '#1a1a1a', borderRadius: '4px', height: '6px' }}>
                    <div style={{ width: `${item.percentage}%`, background: '#1d4ed8', height: '6px', borderRadius: '4px' }} />
                  </div>
                  <button
                    onClick={() => removeStock(item.symbol)}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Stock */}
          <div style={{ marginBottom: '1.5rem', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 12px', color: '#fff' }}>{t.addStock}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder={t.stockSymbol}
                value={customStockSymbol}
                onChange={(e) => setCustomStockSymbol(e.target.value.toUpperCase())}
                style={{ background: '#1a1a1a', border: '0.5px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', minWidth: '80px' }}
              />
              <input
                type="text"
                placeholder={t.stockName}
                value={customStockName}
                onChange={(e) => setCustomStockName(e.target.value)}
                style={{ background: '#1a1a1a', border: '0.5px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', flex: 1, minWidth: '120px' }}
              />
              <input
                type="text"
                placeholder={t.stockSector}
                value={customStockSector}
                onChange={(e) => setCustomStockSector(e.target.value)}
                style={{ background: '#1a1a1a', border: '0.5px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', minWidth: '100px' }}
              />
              <button
                onClick={addCustomStock}
                style={{ background: '#0891b2', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
              >
                {t.add}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <button
              onClick={analysePortfolio}
              disabled={portfolioLoading || totalPercentage !== 100}
              style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', opacity: portfolioLoading || totalPercentage !== 100 ? 0.5 : 1 }}
            >
              {portfolioLoading ? t.analysingPortfolio : t.analysePortfolio}
            </button>
          </div>

          {portfolioAnalysis && (
            <div>
              {/* Score Row */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#0a0a0a', border: '0.5px solid #222', borderRadius: '10px', padding: '1rem', flex: 1, minWidth: '140px', textAlign: 'center' }}>
                  <p style={{ color: '#888', fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase' }}>{t.diversificationScore}</p>
                  <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: portfolioAnalysis.diversificationScore >= 70 ? '#22c55e' : portfolioAnalysis.diversificationScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {portfolioAnalysis.diversificationScore}
                  </p>
                </div>
                <div style={{ background: '#0a0a0a', border: '0.5px solid #222', borderRadius: '10px', padding: '1rem', flex: 1, minWidth: '140px', textAlign: 'center' }}>
                  <p style={{ color: '#888', fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase' }}>{t.overallRisk}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: riskColor(portfolioAnalysis.overallRisk) }}>
                    {portfolioAnalysis.overallRisk}
                  </p>
                </div>
              </div>

              {/* Sector Exposure */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#888', fontSize: '13px', fontWeight: '600', margin: '0 0 10px' }}>{t.sectorExposure}</p>
                {portfolioAnalysis.sectorExposure.map((s) => (
                  <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', minWidth: '100px', color: '#aaa' }}>{s.sector}</span>
                    <div style={{ flex: 1, background: '#1a1a1a', borderRadius: '4px', height: '6px' }}>
                      <div style={{ width: `${s.percentage}%`, background: riskColor(s.risk), height: '6px', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#aaa', minWidth: '40px', textAlign: 'right' }}>{s.percentage}%</span>
                    <span style={{ fontSize: '11px', color: riskColor(s.risk), minWidth: '50px' }}>{s.risk}</span>
                  </div>
                ))}
              </div>

              {/* Strengths and Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#0a1a0a', border: '0.5px solid #22c55e33', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>{t.strengths}</p>
                  {portfolioAnalysis.strengths.map((s, i) => (
                    <p key={i} style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>+ {s}</p>
                  ))}
                </div>
                <div style={{ background: '#1a0a0a', border: '0.5px solid #ef444433', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>{t.weaknesses}</p>
                  {portfolioAnalysis.weaknesses.map((w, i) => (
                    <p key={i} style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>- {w}</p>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: '#0a0a1a', border: '0.5px solid #1d4ed833', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>{t.recommendations}</p>
                {portfolioAnalysis.recommendations.map((r, i) => (
                  <p key={i} style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px', lineHeight: '1.5' }}>{i + 1}. {r}</p>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: '#111', border: '0.5px solid #333', borderRadius: '10px', padding: '1rem' }}>
                <p style={{ color: '#fff', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{portfolioAnalysis.summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Company Health Checker */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '6px' }}>{t.company}</h2>
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

      {/* Auth + Watchlist */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>
          {user ? `Your Watchlist` : 'Sign In to Save Your Watchlist'}
        </h2>
        <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
          {!user ? (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Email address"
                  style={{ flex: 1, minWidth: '200px', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  style={{ flex: 1, minWidth: '200px', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAuth}
                  disabled={authLoading}
                  style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', opacity: authLoading ? 0.5 : 1 }}
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  {authMode === 'login' ? 'No account? Sign up' : 'Have an account? Sign in'}
                </button>
              </div>
              {authMessage && (
                <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '10px' }}>{authMessage}</p>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                  {watchlist.length === 0 ? 'No stocks in your watchlist yet. Click "+ Add to Watchlist" on any stock card above.' : `${watchlist.length} stock${watchlist.length > 1 ? 's' : ''} tracked`}
                </p>
                <button
                  onClick={handleLogout}
                  style={{ background: 'transparent', color: '#666', border: '0.5px solid #333', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Sign Out
                </button>
              </div>
              {watchlist.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {watchlist.map((item) => {
                    const liveStock = stocks.find(s => s.symbol === item.symbol)
                    return (
                      <div key={item.id} style={{ background: '#0a0a0a', border: '0.5px solid #222', borderRadius: '10px', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.symbol}</span>
                          {liveStock && (
                            <span style={{ color: liveStock.change_percent >= 0 ? '#22c55e' : '#ef4444', fontSize: '12px' }}>
                              {liveStock.change_percent >= 0 ? '+' : ''}{liveStock.change_percent}%
                            </span>
                          )}
                        </div>
                        {liveStock && (
                          <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px' }}>{liveStock.price.toLocaleString()} HUF</p>
                        )}
                        <button
                          onClick={() => removeFromWatchlist(item.id)}
                          style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '1rem' }}>{t.chat}</h2>
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