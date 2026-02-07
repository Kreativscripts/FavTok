import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { simulateApiCall } from "./function";

interface DownloadResult {
  success: boolean;
  message: string;
  path?: string; 
}

const sanitize = (value: string) =>
  value
    .replace(/[^\w\-]+/g, "_") 
    .replace(/_+/g, "_")
    .slice(0, 60);

export const initiateDownload = async (url: string): Promise<DownloadResult> => {
  try {
    const { videoUrl, username } = await simulateApiCall(url);

    const date = new Date();
    const safeUser = sanitize(username || "user");
    const filename = `favtok_${safeUser}_${date.getTime()}.mp4`;

    const baseDir = FileSystem.documentDirectory;
    if (!baseDir) {
      return {
        success: false,
        message: "File system not available on this device."
      };
    }

    const localUri = baseDir + filename;

    const result = await FileSystem.downloadAsync(videoUrl, localUri);


    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(result.uri, {
        mimeType: "video/mp4",
        dialogTitle: "Save video",
        UTI: "public.mpeg-4"
      });

      return {
        success: true,
        message: "Downloaded. Choose where to save it.",
        path: result.uri
      };
    }

    return {
      success: true,
      message: Platform.OS === "android"
        ? "Downloaded to app storage. (Sharing not available on this device.)"
        : "Downloaded to app storage.",
      path: result.uri
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown network or download error occurred."
    };
  }
};
