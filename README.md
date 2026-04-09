# HU-Market Intelligence

AI-powered financial intelligence platform built for the Hungarian market.

**Live Platform:** https://hu-market-intelligence.vercel.app

---

## Overview

HU-Market Intelligence is a full-stack financial analytics platform that combines real-time Budapest Stock Exchange data, National Bank of Hungary macro indicators, and Groq AI-powered analysis into a single professional dashboard.

Built as a demonstration of applied AI in financial services — specifically calibrated for the Hungarian market.

---

## Features

**Market Data**
- Live BET stock tracking — OTP Bank, MOL, Richter Gedeon, Magyar Telekom, Opus Global, Autowallis
- All prices in HUF with real-time percentage changes and volume data
- Interactive bar chart showing daily performance across all stocks

**Macro Indicators**
- Base interest rate, CPI inflation, GDP growth, EUR/HUF rate, unemployment, public debt
- Sourced from NBH (National Bank of Hungary) and KSH (Hungarian Central Statistical Office)

**AI Analysis**
- Sector risk analysis powered by Groq LLaMA 3.3 70B
- AI chat interface — query the Hungarian market in plain language
- Company financial health checker — health score, risk level, BUY/HOLD/AVOID rating

**Reports**
- One-click PDF export with full branded financial briefing
- Available in English and Hungarian

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| AI Engine | Groq LLaMA 3.3 70B |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| PDF | jsPDF |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/Gordon-Mensah/hu-market-intelligence.git
cd hu-market-intelligence
npm install
```

Create a `.env.local` file:

```
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

---

## Project Structure

app/

├── page.tsx              # Landing page

├── dashboard/

│   └── page.tsx          # Main dashboard

├── api/

│   ├── market/           # BET stock data

│   ├── macro/            # NBH macro indicators

│   ├── ai/               # Sector risk analysis

│   ├── ai/chat/          # AI chat interface

│   └── company/          # Company health checker

---

## Built By

**John Jerry Gordon-Mensah**
BSc Computer Science Engineering — Dunaújváros Egyetem

Data Scientist · GenAI Engineer · Financial Analyst · Project Manager

[LinkedIn]([https://linkedin.com](https://www.linkedin.com/in/jayejaye/)) · [GitHub](https://github.com/Gordon-Mensah)
