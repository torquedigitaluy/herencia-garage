"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Crea una cuenta de cliente (email + contraseña temporal que el taller le
 * comunica). Usa la service_role key, por eso verifica primero que quien
 * llama sea admin.
 */
export async function crearCliente(email: string, password: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Solo un admin puede crear clientes." };

  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return { error: error.message };

  return { ok: true, id: data.user.id, email: data.user.email };
}
