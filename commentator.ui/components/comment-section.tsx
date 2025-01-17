"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { MessageSquare, Sparkles, RefreshCw, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchVideoComments, addCommentResponse, bulkAnswerComments } from "@/services/api";

interface Comment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  text: string;
  likes: number;
  aiResponse?: string;
  isRemoving?: boolean;
}

export function CommentSection({ videoId, accessToken }: { videoId: string; accessToken: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [customResponse, setCustomResponse] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [respondingComments, setRespondingComments] = useState<Set<string>>(new Set());
  const [isBulkAnswering, setIsBulkAnswering] = useState(false);

  const markCommentAsAnswered = (commentId: string) => {
    const answeredComments = JSON.parse(localStorage.getItem(`answered_comments_${videoId}`) || "[]");
    if (!answeredComments.includes(commentId)) {
      answeredComments.push(commentId);
      localStorage.setItem(`answered_comments_${videoId}`, JSON.stringify(answeredComments));
    }
  };

  const isCommentAnswered = (commentId: string) => {
    const answeredComments = JSON.parse(localStorage.getItem(`answered_comments_${videoId}`) || "[]");
    return answeredComments.includes(commentId);
  };

  const loadComments = async () => {
    try {
      const fetchedComments = await fetchVideoComments(accessToken, videoId);
      const filteredComments = fetchedComments.filter((comment: Comment) => !isCommentAnswered(comment.id));
      setComments(filteredComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [videoId, accessToken]);

  const handleRegenerateResponse = async (commentId: string) => {
    // TODO: Implement AI response regeneration
    console.log("Regenerating response for comment:", commentId);
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

  const handleReloadComments = async () => {
    setLoading(true);
    await loadComments();
  };

  const handleSubmitResponse = async (commentId: string) => {
    try {
      setRespondingComments(new Set([...respondingComments, commentId]));
      const response = isCustomMode ? customResponse : "AI-generated response";
      await addCommentResponse(accessToken, commentId, response);

      markCommentAsAnswered(commentId);

      // Update UI to show the comment is being removed
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, isRemoving: true } : comment)));

      // Remove the comment after animation
      setTimeout(() => {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }, 500);

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
          <Button variant="ghost" size="sm" onClick={handleReloadComments} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
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
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: comment.isRemoving ? 0 : 1,
                x: comment.isRemoving ? 100 : 0,
              }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="bg-secondary/50 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-start gap-4">
                <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{comment.author}</p>
                    {!comment.aiResponse && !activeComment && (
                      <Button variant="ghost" size="sm" onClick={() => setActiveComment(comment.id)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Answer
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{comment.text}</p>
                </div>
              </div>

              {(comment.aiResponse || activeComment === comment.id) && (
                <div className="ml-14 pl-4 border-l-2 border-purple-500 space-y-4">
                  {activeComment === comment.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={isCustomMode ? "opacity-50" : ""}
                          onClick={() => setIsCustomMode(false)}
                        >
                          AI Response
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={!isCustomMode ? "opacity-50" : ""}
                          onClick={() => setIsCustomMode(true)}
                        >
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
