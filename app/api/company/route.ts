import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { company } = await request.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a senior Hungarian financial analyst. When given a company name, provide a structured financial health analysis specific to Hungary's market. 
          
          Always respond in this exact JSON format:
          {
            "company": "company name",
            "sector": "sector name",
            "healthScore": 75,
            "riskLevel": "MEDIUM",
            "strengths": ["strength 1", "strength 2", "strength 3"],
            "risks": ["risk 1", "risk 2", "risk 3"],
            "outlook": "2-3 sentence outlook for this company in Hungary",
            "recommendation": "BUY or HOLD or AVOID"
          }
          
          Health score is 0-100. Be specific to Hungarian market conditions.
          Return ONLY the JSON, no other text.`
        },
        {
          role: 'user',
          content: `Analyse this company operating in Hungary: ${company}`
        }
      ],
      max_tokens: 500,
    })

    const raw = completion.choices[0].message.content || '{}'
    const analysis = JSON.parse(raw)

    return NextResponse.json({ success: true, data: analysis })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}