import { Platform, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { simulateApiCall } from './function';

interface DownloadResult {
  success: boolean;
  message: string;
  path?: string;
}

export const initiateDownload = async (url: string): Promise<DownloadResult> => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return { success: false, message: 'Storage permission is required to save videos.' };
    }

    const { videoUrl, username } = await simulateApiCall(url);
    const date = new Date();
    const filename = `favtok_${username}_${date.getTime()}.mp4`;
    
    const downloadPath = Platform.select({
      ios: RNFetchBlob.fs.dirs.DocumentDir,
      android: RNFetchBlob.fs.dirs.DownloadDir,
    }) + `/${filename}`;

    const response = await RNFetchBlob.config({
      fileCache: true,
      path: downloadPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: filename,
        description: 'TikTok video download',
        mime: 'video/mp4',
      },
    }).fetch('GET', videoUrl);

    return {
      success: true,
      message: 'Download completed successfully.',
      path: response.path()
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown network or download error occurred.'
    };
  }
};

const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || Platform.Version < 23) return true;
  
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'FavTok needs access to your storage to save videos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};