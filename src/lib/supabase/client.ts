import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicKey } from './env'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = getSupabasePublicKey()!
  return createBrowserClient(url, key)
}
