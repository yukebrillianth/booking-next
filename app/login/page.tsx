"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { signInWithEmail, signInWithGoogle } from "@/app/actions/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [emailLoginState, emailLoginAction] = useFormState(signInWithEmail, {
    error: "",
  });
  const [googleLoginState, googleLoginAction] = useFormState(signInWithGoogle, {
    error: "",
  });

  useEffect(() => {
    if (emailLoginState?.error) {
      setMessage(emailLoginState.error);
    } else if (googleLoginState?.error) {
      setMessage(googleLoginState.error);
    }
  }, [emailLoginState, googleLoginState]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form action={emailLoginAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login with Email
          </Button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <form action={googleLoginAction}>
          <Button type="submit" className="w-full" variant="outline">
            Login with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
