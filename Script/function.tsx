import Constants from "expo-constants";

interface ApiResponse {
  downloadUrl?: string;
  videoUrl?: string;
  url?: string;
  username?: string;
}

export async function simulateApiCall(
  tiktokUrl: string
): Promise<{ videoUrl: string; username: string }> {
  if (!tiktokUrl || typeof tiktokUrl !== "string") {
    throw new Error("Please enter a TikTok link.");
  }

  const extra = Constants.expoConfig?.extra as any;
  const RAPIDAPI_KEY = extra?.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is missing. Add it in app.json extra.");
  }

  const endpoint =
    "https://tiktok-video-downloader-api.p.rapidapi.com/media?videoUrl=" +
    encodeURIComponent(tiktokUrl);

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "tiktok-video-downloader-api.p.rapidapi.com"
    }
  });

  const data: ApiResponse = await res.json();

  if (!res.ok) {
    throw new Error("RapidAPI error: " + JSON.stringify(data));
  }

  const videoUrl = data.downloadUrl || data.videoUrl || data.url;

  if (!videoUrl) {
    throw new Error("No download URL returned from API.");
  }

  return {
    videoUrl,
    username: data.username || "user"
  };
}

export function isValidTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.toLowerCase();
    const isTikTokHost =
      host === "tiktok.com" ||
      host === "www.tiktok.com" ||
      host === "vm.tiktok.com" ||
      host.endsWith(".tiktok.com");
    return u.protocol === "https:" && isTikTokHost;
  } catch {
    return false;
  }
}

export function extractUsernameFromTikTokUrl(url: string): string {
  const match = url.match(/tiktok\.com\/@([^/]+)/i);
  return match?.[1] || "user";
}
