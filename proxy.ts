import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protege las rutas /admin y /cliente: refresca la sesión de Supabase en cada
 * request y redirige al login correspondiente a quien no esté autenticado.
 * (En Next 16 este archivo reemplaza a middleware.ts.)
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // No usar getSession() acá: getUser() revalida el token contra Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esPortalCliente = path.startsWith("/cliente");
  const esLogin = path === "/admin/login" || path === "/cliente/login";

  if (!user && !esLogin) {
    const url = request.nextUrl.clone();
    url.pathname = esPortalCliente ? "/cliente/login" : "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && esLogin) {
    const url = request.nextUrl.clone();
    url.pathname = esPortalCliente ? "/cliente/dashboard" : "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
