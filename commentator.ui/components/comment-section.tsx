"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { MessageSquare, Sparkles, RefreshCw, ThumbsUp, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchVideoComments, addCommentResponse, likeComment, bulkAnswerComments } from "@/services/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [customResponse, setCustomResponse] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [respondingComments, setRespondingComments] = useState<Set<string>>(new Set());
  const [isBulkAnswering, setIsBulkAnswering] = useState(false);

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

  const handleRegenerateResponse = async (commentId: string) => {
    // TODO: Implement AI response regeneration
    console.log("Regenerating response for comment:", commentId);
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(accessToken, commentId);
      setLikedComments(new Set([...likedComments, commentId]));
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const handleBulkAnswer = async () => {
    try {
      setIsBulkAnswering(true);
      await bulkAnswerComments(accessToken, videoId);
      // Refresh comments after bulk answering
      const fetchedComments = await fetchVideoComments(accessToken, videoId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to bulk answer comments:", err);
    } finally {
      setIsBulkAnswering(false);
    }
  };

  const handleSubmitResponse = async (commentId: string) => {
    try {
      setRespondingComments(new Set([...respondingComments, commentId]));
      const response = isCustomMode ? customResponse : "AI-generated response";
      await addCommentResponse(accessToken, commentId, response);
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, aiResponse: response } : comment)));
      setActiveComment(null);
      setCustomResponse("");
    } catch (err) {
      console.error("Failed to submit response:", err);
    } finally {
      setRespondingComments(new Set([...respondingComments].filter((id) => id !== commentId)));
    }
  };

  if (loading) return <div className="text-center py-8">Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBulkAnswer} disabled={isBulkAnswering} className="gap-2">
            {isBulkAnswering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Answer All
          </Button>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Go to video →
          </a>
        </div>
      </div>

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
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{comment.author}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={likedComments.has(comment.id)}
                      className={likedComments.has(comment.id) ? "text-purple-500" : ""}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    {!comment.aiResponse && !activeComment && (
                      <Button variant="ghost" size="sm" onClick={() => setActiveComment(comment.id)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Answer
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 mt-1">{comment.text}</p>
              </div>
            </div>

            {(comment.aiResponse || activeComment === comment.id) && (
              <div className="ml-14 pl-4 border-l-2 border-purple-500 space-y-4">
                {activeComment === comment.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className={isCustomMode ? "opacity-50" : ""} onClick={() => setIsCustomMode(false)}>
                        AI Response
                      </Button>
                      <Button variant="ghost" size="sm" className={!isCustomMode ? "opacity-50" : ""} onClick={() => setIsCustomMode(true)}>
                        Custom Response
                      </Button>
                    </div>
                    {isCustomMode ? (
                      <textarea
                        value={customResponse}
                        onChange={(e) => setCustomResponse(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full min-h-[100px] bg-secondary/30 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <p className="text-white">AI-generated response will appear here...</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {!isCustomMode && (
                        <Button variant="outline" size="sm" onClick={() => handleRegenerateResponse(comment.id)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleSubmitResponse(comment.id)}>
                        Submit Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">AI-Generated Response</p>
                      {respondingComments.has(comment.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                      ) : (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white">{comment.aiResponse}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleRegenerateResponse(comment.id)}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
