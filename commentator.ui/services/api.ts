const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchYouTubeVideos(accessToken: string) {
  const response = await fetch(`${BACKEND_URL}/api/youtube/videos`, {
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
  const response = await fetch(`${BACKEND_URL}/api/youtube/videos/${videoId}/comments`, {
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
  const result = await fetch(`${BACKEND_URL}/api/youtube/comments/${commentId}/reply`, {
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

export async function bulkAnswerComments(accessToken: string, videoId: string) {
  const result = await fetch(`${BACKEND_URL}/api/youtube/videos/${videoId}/bulk-answer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!result.ok) {
    throw new Error("Failed to bulk answer comments");
  }
}

export async function fetchComments(videoId: string, accessToken: string) {
  const response = await fetch(`${BACKEND_URL}/api/youtube/comments/${videoId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function generateResponse(commentId: string, accessToken: string) {
  const response = await fetch(`${BACKEND_URL}/api/youtube/generate/${commentId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate response");
  }

  return response.json();
}

export async function fetchYouTubeShorts(accessToken: string) {
  const response = await fetch(`${BACKEND_URL}/api/youtube/shorts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shorts");
  }

  return response.json();
}
