import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { simulateApiCall } from "./function";

interface DownloadResult {
  success: boolean;
  message: string;
  path?: string;
}

export const initiateDownload = async (url: string): Promise<DownloadResult> => {
  try {
    const { videoUrl, username } = await simulateApiCall(url);

    const filename = `favtok_${username}_${Date.now()}.mp4`;

    const baseDir = FileSystem.documentDirectory;
    if (!baseDir) {
      return {
        success: false,
        message: "File system not available."
      };
    }

    const fileUri = baseDir + filename;

    const result = await FileSystem.downloadAsync(videoUrl, fileUri);

    // Open share/save menu (best Expo-compatible way)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        mimeType: "video/mp4",
        dialogTitle: "Save TikTok Video"
      });
    }

    return {
      success: true,
      message: "Download complete!",
      path: result.uri
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unknown download error occurred."
    };
  }
};
