import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // client Supabase di sisi server

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code"); // kode dari Supabase (berisi token user)

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  try {
    // Tukarkan kode dengan sesi (token)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/login?message=${error.message}`);
    }

    // Jika berhasil, redirect ke halaman utama
    return NextResponse.redirect(`${origin}/home`);
  } catch (e) {
    console.error("Unexpected error during auth callback:", e);
    return NextResponse.redirect(
      `${origin}/login?message=An unexpected error occurred during login.`
    );
  }
}
