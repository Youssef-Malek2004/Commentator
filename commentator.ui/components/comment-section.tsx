"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
  aiResponse?: string;
}

export function CommentSection({ videoId, comments }: { videoId: string; comments: Comment[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Unanswered Comments</h2>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Answer All
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-secondary/50 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-white">{comment.author}</p>
                <p className="text-gray-400 mt-1">{comment.text}</p>
              </div>
              <Button size="sm" variant="ghost" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Answer
              </Button>
            </div>

            {comment.aiResponse && (
              <div className="pl-4 border-l-2 border-purple-500">
                <p className="text-sm text-gray-400 mb-1">AI-Generated Response:</p>
                <p className="text-white">{comment.aiResponse}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
