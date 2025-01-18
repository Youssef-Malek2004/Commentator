"use client";

import { Button } from "./ui/button";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface VideoPreviewProps {
  thumbnail: string;
  title: string;
  showThumbnail: boolean;
  setShowThumbnail: (show: boolean) => void;
  isShort?: boolean;
}

export function VideoPreview({ thumbnail, title, showThumbnail, setShowThumbnail, isShort }: VideoPreviewProps) {
  const handleToggleThumbnail = () => {
    const newValue = !showThumbnail;
    setShowThumbnail(newValue);
    localStorage.setItem("showThumbnail", JSON.stringify(newValue));
  };

  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`flex-1 ${isShort ? "max-w-[315px] mx-auto" : ""}`}>
        {showThumbnail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`relative rounded-xl overflow-hidden ${isShort ? "aspect-[9/16]" : "aspect-video"}`}
          >
            <Image src={thumbnail} alt={title} fill className="object-cover" />
            {isShort && (
              <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">#Shorts</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={handleToggleThumbnail} className="flex-shrink-0">
        <ImageIcon className={`w-4 h-4 ${showThumbnail ? "text-purple-500" : "text-gray-400"}`} />
      </Button>
    </div>
  );
}
