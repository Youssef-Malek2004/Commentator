"use client";

import { Button } from "./button";
import { motion } from "framer-motion";

export function YoutubeCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-secondary/30 p-6 backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-white/5" />

      <div className="relative space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-red-500/10 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-red-500" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Your Videos</h3>
            <p className="text-sm text-gray-400">View and manage your content</p>
          </div>
        </div>

        <p className="text-gray-400">
          Enhance your social media presence with AI-powered engagement. Manage comments and boost interaction across your videos.
        </p>

        <Button onClick={onClick} className="w-full bg-red-500 hover:bg-red-600 text-white border-none">
          Preview Videos
        </Button>
      </div>
    </motion.div>
  );
}
