export const validateTikTokUrl = (url: string): boolean => {
  const tiktokPattern = /^https:\/\/(www\.|vm\.|)tiktok\.com\/.+\/video\/\d+/;
  const trimmedUrl = url.trim();
  return tiktokPattern.test(trimmedUrl) && trimmedUrl.length > 0;
};

export const extractVideoId = (url: string): string | null => {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

export const simulateApiCall = async (url: string): Promise<{ videoUrl: string; username: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const videoId = extractVideoId(url);
  return {
    videoUrl: `https://api-tiktok.example.com/video/${videoId}/download`,
    username: url.split('/@')[1]?.split('/')[0] || 'user'
  };
};