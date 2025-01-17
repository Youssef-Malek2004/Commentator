"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, ThumbsUp, MessageCircle } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  statistics: {
    views: string;
    likes: string;
    commentCount: string;
  };
}

export function VideoGrid({ videos, onVideoClick }: { videos: Video[]; onVideoClick: (video: Video) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onVideoClick(video)}
          className="group relative overflow-hidden rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-200 cursor-pointer"
        >
          <div className="aspect-video relative">
            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-white line-clamp-2 mb-2">{video.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{video.statistics.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={14} />
                <span>{video.statistics.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{video.statistics.commentCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
