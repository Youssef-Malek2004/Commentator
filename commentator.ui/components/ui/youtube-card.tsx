"use client";

import { Youtube } from "lucide-react";
import { motion } from "framer-motion";

export function YoutubeCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass cursor-pointer group relative overflow-hidden rounded-xl"
      onClick={onClick}
    >
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="relative">
          <Youtube className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full -z-10" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white">Your YouTube Videos</h3>
        <p className="text-gray-400 text-center">Click to view and manage your YouTube content</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-purple-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-200" />
    </motion.div>
  );
}
