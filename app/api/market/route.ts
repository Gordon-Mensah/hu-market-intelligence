import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const HU_STOCKS = [
  { symbol: 'OTP', name: 'OTP Bank Nyrt.', sector: 'Banking', basePrice: 19850 },
  { symbol: 'MOL', name: 'MOL Magyar Olaj', sector: 'Energy', basePrice: 2756 },
  { symbol: 'RICHTER', name: 'Richter Gedeon', sector: 'Pharma', basePrice: 9180 },
  { symbol: 'MTELEKOM', name: 'Magyar Telekom', sector: 'Telecom', basePrice: 1042 },
  { symbol: 'OPUS', name: 'Opus Global', sector: 'Investment', basePrice: 415 },
  { symbol: 'AUTOWALLIS', name: 'Autowallis Nyrt.', sector: 'Automotive', basePrice: 674 },
]

function getRealisticPrice(basePrice: number) {
  const now = new Date()
  const seed = now.getHours() * 60 + now.getMinutes()
  const change = (Math.sin(seed * 0.1) * 1.5) + (Math.random() - 0.5) * 0.8
  const price = basePrice * (1 + change / 100)
  return {
    price: Math.round(price),
    change_percent: Math.round(change * 100) / 100,
    volume: Math.floor(Math.random() * 400000) + 80000,
  }
}

export async function GET() {
  try {
    const marketData = HU_STOCKS.map((stock) => {
      const { price, change_percent, volume } = getRealisticPrice(stock.basePrice)
      return {
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        price,
        change_percent,
        volume,
        market: 'BET',
      }
    })

    const { error } = await supabase
      .from('market_data')
      .insert(marketData)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString(),
      source: 'BÉT Reference Prices (Live Simulation)',
      note: 'Prices based on real BÉT reference values with live market fluctuation'
    })
  } catch (error: any) {
    console.error('Market API error:', error?.message)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}