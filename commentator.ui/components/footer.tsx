import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 bg-[hsl(var(--footer-bg))] border-t border-border">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Commentator" width={24} height={24} />
          <span className="text-sm text-gray-400">© 2024 Commentator. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
