"use client";

import { Button } from "@/components/ui/button";
import { YoutubeCard } from "@/components/ui/youtube-card";
import { VideoGrid } from "@/components/video-grid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { fetchYouTubeVideos } from "@/services/api";
import { CommentSection } from "@/components/comment-section";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showVideos, setShowVideos] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleFetchVideos = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedVideos = await fetchYouTubeVideos(session.accessToken);
      setVideos(fetchedVideos);
      setShowVideos(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  // Mock data for testing
  const mockComments = [
    {
      id: "1",
      author: "John Doe",
      text: "Great video! How did you achieve that effect at 2:35?",
      likes: 15,
      aiResponse:
        "Thank you for your kind words! The effect at 2:35 was created using a combination of motion tracking and particle systems in After Effects. I'll be making a tutorial about it soon!",
    },
    {
      id: "2",
      author: "Jane Smith",
      text: "Could you make a tutorial on this topic?",
      likes: 8,
    },
    // Add more mock comments...
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-red-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-xl" />
      </div>

      <div className="p-8">
        {/* Header with logout */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {session?.user?.email}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 hover:text-red-500">
            <LogOut size={16} />
            Logout
          </Button>
        </motion.div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!showVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <YoutubeCard onClick={handleFetchVideos} />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Videos</h2>
                <Button variant="ghost" onClick={() => setShowVideos(false)} className="text-gray-400 hover:text-white">
                  Back
                </Button>
              </div>
              {loading ? (
                <div className="text-center py-8">Loading your videos...</div>
              ) : (
                <>
                  {selectedVideo ? (
                    <div className="space-y-8">
                      <Button variant="ghost" onClick={() => setSelectedVideo(null)} className="mb-4">
                        ← Back to Videos
                      </Button>
                      <div className="aspect-video relative rounded-xl overflow-hidden">
                        <Image src={selectedVideo.thumbnail} alt={selectedVideo.title} fill className="object-cover" />
                      </div>
                      <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                      <CommentSection videoId={selectedVideo.id} accessToken={session?.accessToken ?? ""} />
                    </div>
                  ) : (
                    <VideoGrid videos={videos} onVideoClick={(video) => setSelectedVideo(video)} />
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
