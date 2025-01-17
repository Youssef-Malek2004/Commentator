import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Commentator - AI-Powered YouTube Comments",
  description: "Generate engaging, personalized comments for YouTube videos using advanced AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
