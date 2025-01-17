import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Commentator" width={32} height={32} />
          <span className="font-bold text-xl">Commentator.AI</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
