import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert Hungarian financial market analyst and advisor. 
          You have deep knowledge of:
          - Budapest Stock Exchange (BÉT) and Hungarian stocks like OTP Bank, MOL, Richter Gedeon, Magyar Telekom
          - National Bank of Hungary (NBH/MNB) monetary policy and interest rates
          - Hungarian macroeconomic indicators from KSH (inflation, GDP, unemployment)
          - EUR/HUF exchange rate dynamics
          - Hungarian SME business environment and risks
          - EU funding and its impact on Hungary
          
          Always give specific, actionable insights relevant to Hungary.
          Keep answers concise — maximum 4 sentences.
          Be direct and confident like a senior analyst.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300,
    })

    const response = completion.choices[0].message.content || ''

    return NextResponse.json({ success: true, response })
  } catch (error: any) {
    console.error('Chat error:', error?.message)
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}