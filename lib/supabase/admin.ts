import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — SALTEA RLS. SOLO puede usarse en el servidor
 * (server actions / route handlers) y siempre después de verificar que quien
 * llama es admin. Nunca importar desde un componente client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
