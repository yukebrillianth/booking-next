"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(
  prevState: { error: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/home");
  return { error: "" }; // Return a default state after redirect
}

export async function signInWithGoogle(prevState: { error: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Supabase's signInWithOAuth will redirect the user to the OAuth provider,
  // so we don't need a redirect here if data.url is present.
  // If data.url is not present, it means the redirect happened internally.
  if (data.url) {
    redirect(data.url);
  }
  return { error: "" }; // Return a default state after redirect
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
