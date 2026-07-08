import { createBrowserClient } from "@supabase/ssr";

/** Cliente de Supabase para componentes client (navegador). Usa la anon key: solo puede hacer lo que permiten las políticas RLS. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
