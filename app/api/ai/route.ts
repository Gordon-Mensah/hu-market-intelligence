import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { supabase } from '@/lib/supabase'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SECTORS = ['Banking', 'Energy', 'Pharma', 'Telecom', 'Automotive']

export async function GET() {
  try {
    const insights = await Promise.all(
      SECTORS.map(async (sector) => {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `You are a Hungarian financial analyst. In 2 sentences, give a current risk summary for the ${sector} sector in Hungary. Be specific and mention Hungarian market conditions. End with a risk level: LOW, MEDIUM, or HIGH.`
            }
          ],
          max_tokens: 150,
        })

        const summary = completion.choices[0].message.content || ''
        const risk_level = summary.includes('HIGH') ? 'HIGH'
          : summary.includes('LOW') ? 'LOW' : 'MEDIUM'

        return { sector, summary, risk_level }
      })
    )

    const { error } = await supabase
      .from('ai_insights')
      .insert(insights)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({ success: true, data: insights })
  } catch (error: any) {
    console.error('Full error:', error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate insights' },
      { status: 500 }
    )
  }
}