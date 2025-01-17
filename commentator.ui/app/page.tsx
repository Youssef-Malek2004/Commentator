"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo and App Name */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold">
            <Image src="/favicon.ico" alt="Commentator" width={40} height={40} />
            <span>Commentator</span>
          </div>
          <p className="text-gray-400">AI-Powered Social Media Engagement</p>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="p-2 rounded-full bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-red-500" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="p-2 rounded-full bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="p-2 rounded-full bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight rainbow-text-container">
              {["Elevate", "Your", "Social", "\n", "Media", "Presence"].map((word, i) => (
                <span
                  key={i}
                  className="inline-block animate-text-fade"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {word === "\n" ? <br /> : word + "\u00A0"}
                </span>
              ))}
            </h1>
            <p className="text-lg text-gray-400">Generate engaging, personalized responses across multiple platforms using advanced AI</p>
          </div>

          {/* Login Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full py-6 text-lg bg-white hover:bg-gray-100 text-black transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            onClick={handleGoogleLogin}
            disabled={status === "loading"}
          >
            <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="mr-2" />
            {status === "loading" ? "Loading..." : "Continue with Google"}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-red-500/20 opacity-50" />
      </div>
    </div>
  );
}
