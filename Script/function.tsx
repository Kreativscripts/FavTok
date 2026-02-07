import Constants from "expo-constants";

type ApiResult = {
  videoUrl: string;
};

function getRapidApiKey(): string {
  const extra = Constants.expoConfig?.extra as any;
  const key = extra?.RAPIDAPI_KEY;

  if (!key || typeof key !== "string") {
    throw new Error(
      "RAPIDAPI_KEY is missing. Add it to app.json extra and set it in EAS env for the build environment."
    );
  }

  return key;
}

export function isValidTikTokUrl(tiktokUrl: string): boolean {
  try {
    const u = new URL(tiktokUrl);
    return (
      (u.hostname === "www.tiktok.com" ||
        u.hostname === "tiktok.com" ||
        u.hostname === "vm.tiktok.com" ||
        u.hostname.endsWith(".tiktok.com")) &&
      u.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export async function downloadTikTokVideo(inputUrl: string): Promise<ApiResult> {
  if (!inputUrl || typeof inputUrl !== "string") {
    throw new Error("Please provide a TikTok URL.");
  }
  const url = inputUrl.trim();

  if (!isValidTikTokUrl(url)) {
    throw new Error("Invalid TikTok URL. Please paste a full https://tiktok.com/... link.");
  }

  const rapidKey = getRapidApiKey();
  const endpoint = "https://tiktok-video-downloader-api.p.rapidapi.com/media";
  
  const params = new URLSearchParams({
    videoUrl: url
  });

  const apiUrl = `${endpoint}?${params}`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-key": rapidKey,
      "x-rapidapi-host": "tiktok-video-downloader-api.p.rapidapi.com"
    }
  });

  const text = await res.text();
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = text;
  }

  if (!res.ok) {
    throw new Error(
      `RapidAPI request failed (${res.status}). ${typeof payload === "string" ? payload : JSON.stringify(payload)}`
    );
  }

  const videoUrl = payload?.downloadUrl || 
                  payload?.videoUrl || 
                  payload?.url ||
                  payload?.data?.downloadUrl ||
                  payload?.data?.videoUrl ||
                  payload?.data?.url;
  
  if (!videoUrl || typeof videoUrl !== "string" || !videoUrl.startsWith("http")) {
    throw new Error(
      "RapidAPI response did not include a usable video download URL."
    );
  }

  return { videoUrl };
}