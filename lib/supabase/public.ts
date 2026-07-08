import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente anónimo sin cookies, para leer datos públicos (ej. portfolio) desde
 * Server Components estáticos sin volver dinámica la página.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
