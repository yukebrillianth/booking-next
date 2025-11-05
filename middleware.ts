// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedPaths = ["/", "/home"];
  const loginPath = "/login";

  // 1️⃣ Jika belum login dan mencoba akses halaman yang dilindungi
  if (!session && protectedPaths.includes(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = loginPath;
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2️⃣ Jika sudah login tapi mencoba masuk ke /login atau /auth/callback
  if (
    session &&
    (request.nextUrl.pathname === loginPath ||
      request.nextUrl.pathname.startsWith("/auth/callback"))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/home";
    return NextResponse.redirect(redirectUrl);
  }

  // 3️⃣ Lanjutkan request jika tidak ada kondisi di atas
  return response;
}

// Konfigurasi matcher: hanya terapkan ke path tertentu
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
