"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <div className="relative w-5 h-5">
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              fill
              className="object-contain"
            />
          </div>
          <span>Lanjutkan dengan Google</span>
        </>
      )}
    </Button>
  );
}
