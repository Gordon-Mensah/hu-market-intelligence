import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MACRO_DATA = [
  { indicator_name: 'Base Interest Rate', value: 6.5, unit: '%', period: 'Q1 2026', source: 'NBH' },
  { indicator_name: 'Inflation Rate (CPI)', value: 4.7, unit: '%', period: 'Feb 2026', source: 'KSH' },
  { indicator_name: 'GDP Growth', value: 1.8, unit: '%', period: 'Q4 2025', source: 'KSH' },
  { indicator_name: 'EUR/HUF Rate', value: 404.5, unit: 'HUF', period: 'Live', source: 'NBH' },
  { indicator_name: 'Unemployment Rate', value: 4.1, unit: '%', period: 'Jan 2026', source: 'KSH' },
  { indicator_name: 'Public Debt / GDP', value: 73.2, unit: '%', period: '2025', source: 'NBH' },
]

export async function GET() {
  try {
    const { error } = await supabase
      .from('macro_indicators')
      .insert(MACRO_DATA)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: MACRO_DATA,
      timestamp: new Date().toISOString(),
      source: 'NBH / KSH Official Data'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}