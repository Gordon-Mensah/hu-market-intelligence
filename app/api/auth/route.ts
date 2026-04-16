import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()

    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}