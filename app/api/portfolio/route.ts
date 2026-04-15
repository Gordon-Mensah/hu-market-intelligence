import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { portfolio, language } = await request.json()
    const lang = language || 'EN'

    const portfolioText = portfolio
      .map((p: { symbol: string; amount: number; percentage: number }) =>
        `${p.symbol}: ${p.percentage}% (${p.amount.toLocaleString()} HUF)`
      )
      .join(', ')

    const systemPrompt = lang === 'HU'
      ? `Te a Budapest Értéktőzsde (BÉT) befektetésekben specializálódott senior magyar portfólióelemző vagy. Elemezd az adott magyar részvények portfólió allokációját és válaszolj ebben a pontos JSON formátumban:
          {
            "overallRisk": "ALACSONY vagy KÖZEPES vagy MAGAS",
            "diversificationScore": 75,
            "sectorExposure": [
              { "sector": "Banki", "percentage": 40, "risk": "KÖZEPES" }
            ],
            "strengths": ["erősség 1", "erősség 2"],
            "weaknesses": ["gyengeség 1 - konkrét szimbólumokkal", "gyengeség 2"],
            "recommendations": ["Csökkentsd az OTP koncentrációt", "Növeld a diverzifikációt MOL és RICHTER között", "Rendszeres felülvizsgálat szükséges"],
            "suggestedChanges": {
              "increase": ["MOL", "RICHTER"],
              "decrease": ["OTP"],
              "remove": [],
              "add": []
            },
            "summary": "2-3 mondatos összefoglaló értékelés"
          }
          FONTOS: 
          - A suggestedChanges mezőben CSAK valós BÉT részvénytörténeteket listázz (OTP, MOL, RICHTER, MTELEKOM, OPUS, AUTOWALLIS stb.)
          - Konkrét szimbólumok alapján végezz ajánlásokat
          - Szektor terhelésre alapozva végezz javaslatokat
          - Minden szimbólumnak az aktuális portfólióban kell lennie vagy közismert BÉT részvénynek lennie
          Válasz CSAK a JSON, semmi más.`
      : `You are a senior Hungarian portfolio analyst specializing in Budapest Stock Exchange (BÉT) investments. Analyse the given portfolio and respond in this EXACT JSON format:
          {
            "overallRisk": "LOW or MEDIUM or HIGH",
            "diversificationScore": 75,
            "sectorExposure": [
              { "sector": "Banking", "percentage": 40, "risk": "MEDIUM" }
            ],
            "strengths": ["strength 1", "strength 2"],
            "weaknesses": ["weakness 1 - with specific symbols", "weakness 2"],
            "recommendations": ["Reduce OTP concentration risk", "Increase diversification between MOL and RICHTER", "Regular rebalancing needed"],
            "suggestedChanges": {
              "increase": ["MOL", "RICHTER"],
              "decrease": ["OTP"],
              "remove": [],
              "add": []
            },
            "summary": "2-3 sentence overall assessment"
          }
          CRITICAL RULES:
          - suggestedChanges MUST contain ONLY actual BÉT stock symbols (OTP, MOL, RICHTER, MTELEKOM, OPUS, AUTOWALLIS, BUX, TKPP, VCORO, etc.)
          - Base suggestions on actual sector exposure and concentration analysis
          - Recommend stocks already in the portfolio or well-known BÉT stocks
          - If mentioning "small-cap" or sector-specific advice, map to actual symbols
          - Each symbol should appear based on portfolio imbalances
          Return ONLY valid JSON, no other text.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: lang === 'HU'
            ? `Elemezd ezt a magyar részvény portfóliót: ${portfolioText}`
            : `Analyse this Hungarian stock portfolio: ${portfolioText}`
        }
      ],
      max_tokens: 700,
    })

    const raw = completion.choices[0].message.content || '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    return NextResponse.json({ success: true, data: analysis })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}