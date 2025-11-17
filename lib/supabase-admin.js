import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasPublicClient = Boolean(supabaseUrl && supabaseAnonKey)
const hasServiceRole = Boolean(supabaseUrl && serviceRoleKey)

if (!hasPublicClient) {
  console.warn(
    'Supabase public client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

if (!hasServiceRole) {
  console.warn(
    'Supabase service role client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  )
}

// Client for client-side operations (respects RLS)
export const supabase = hasPublicClient
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = hasServiceRole
  ? createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  : null

export const isSupabaseConfigured = Boolean(supabase && supabaseAdmin)
