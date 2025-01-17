"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchVideoComments } from "@/services/api";

interface Comment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  text: string;
  likes: number;
  aiResponse?: string;
}

export function CommentSection({ videoId, accessToken }: { videoId: string; accessToken: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchVideoComments(accessToken, videoId);
        setComments(fetchedComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [videoId, accessToken]);

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    setNewComment("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Go to video →
        </a>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[100px] bg-secondary/50 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-secondary/50 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-start gap-4">
              <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-white">{comment.author}</p>
                <p className="text-gray-400 mt-1">{comment.text}</p>
              </div>
            </div>

            {comment.aiResponse && (
              <div className="ml-14 pl-4 border-l-2 border-purple-500">
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
