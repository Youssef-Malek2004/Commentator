import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";

export function LegalLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Commentator" width={32} height={32} />
            <span className="font-bold text-xl">Commentator.AI</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          <div className="prose prose-invert max-w-none">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
