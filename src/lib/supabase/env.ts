/**
 * Public Supabase key: supports legacy anon key or new dashboard "publishable" key.
 * @see https://supabase.com/docs/guides/api
 */
export function getSupabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  )
}
