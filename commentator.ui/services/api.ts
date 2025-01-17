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

export async function fetchVideoComments(accessToken: string, videoId: string) {
  const response = await fetch(`http://localhost:5138/api/youtube/videos/${videoId}/comments`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function addCommentResponse(accessToken: string, commentId: string, response: string) {
  const result = await fetch(`http://localhost:5138/api/youtube/comments/${commentId}/reply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ response }),
  });

  if (!result.ok) {
    throw new Error("Failed to add response");
  }
}
