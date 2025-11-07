import { createBrowserClient } from '@supabase/ssr'

console.log("SUPABASE_HTTP_URL:",process.env.NEXT_PUBLIC_SUPABASE_URL);

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANONYMOUS_KEY!
  )
}