"use client";

import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // Redirect to dashboard when logged in
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
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold">
            <Youtube className="w-10 h-10 text-red-500" />
            <span>Commentator</span>
          </div>
          <p className="text-gray-400">AI-Powered YouTube Engagement</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Elevate Your YouTube Presence
            </h1>
            <p className="text-lg text-gray-400">
              Generate engaging, personalized comments for your favorite YouTube videos using advanced AI
            </p>
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
