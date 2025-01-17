export async function fetchYouTubeVideos(accessToken: string) {
  const response = await fetch("http://localhost:5138/api/youtube/videos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
}
