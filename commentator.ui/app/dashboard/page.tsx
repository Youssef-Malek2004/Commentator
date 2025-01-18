"use client";

import { Button } from "@/components/ui/button";
import { YoutubeCard } from "@/components/ui/youtube-card";
import { VideoGrid } from "@/components/video-grid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchYouTubeVideos, fetchYouTubeShorts } from "@/services/api";
import { CommentSection } from "@/components/comment-section";
import Image from "next/image";
import { VideoPreview } from "@/components/video-preview";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  statistics: {
    views: string;
    likes: string;
    commentCount: string;
  };
  isShort?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showVideos, setShowVideos] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showThumbnail, setShowThumbnail] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showThumbnail");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [shorts, setShorts] = useState<Video[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (showVideos && videos.length === 0 && shorts.length === 0) {
      handleFetchContent();
    }
  }, [showVideos]);

  const handleFetchContent = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const [fetchedVideos, fetchedShorts] = await Promise.all([
        fetchYouTubeVideos(session.accessToken),
        fetchYouTubeShorts(session.accessToken),
      ]);
      setVideos(fetchedVideos);
      setShorts(fetchedShorts);
      setShowVideos(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-red-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-xl" />
      </div>

      <div className="p-8 flex-1">
        {/* Header with logout and branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto flex justify-between items-center mb-12"
        >
          <div className="flex items-center gap-3">
            <Image src="/favicon.ico" alt="Commentator" width={32} height={32} />
            <div>
              <h1 className="brand-text text-3xl font-bold bg-clip-text text-transparent">Commentator</h1>
              <p className="text-gray-400">Welcome back, {session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => signOut()} className="text-sm">
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!showVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <YoutubeCard onClick={handleFetchContent} />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Content</h2>
                <Button variant="ghost" onClick={() => setShowVideos(false)} className="text-gray-400 hover:text-white">
                  Back
                </Button>
              </div>
              {loading ? (
                <div className="text-center py-8">Loading your content...</div>
              ) : (
                <>
                  {selectedVideo ? (
                    <div className="space-y-8">
                      <Button variant="ghost" onClick={() => setSelectedVideo(null)} className="mb-4">
                        ← Back to Content
                      </Button>
                      <VideoPreview
                        thumbnail={selectedVideo.thumbnail}
                        title={selectedVideo.title}
                        showThumbnail={showThumbnail}
                        setShowThumbnail={setShowThumbnail}
                        isShort={selectedVideo.isShort}
                      />
                      <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                      <CommentSection videoId={selectedVideo.id} accessToken={session?.accessToken ?? ""} />
                    </div>
                  ) : (
                    <Tabs defaultValue="videos" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
                        <TabsTrigger value="shorts">Shorts ({shorts.length})</TabsTrigger>
                      </TabsList>
                      <TabsContent value="videos">
                        <VideoGrid videos={videos} onVideoClick={(video) => setSelectedVideo(video)} />
                      </TabsContent>
                      <TabsContent value="shorts">
                        <VideoGrid videos={shorts} onVideoClick={(video) => setSelectedVideo(video)} />
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
