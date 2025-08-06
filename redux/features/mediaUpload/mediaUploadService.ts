// redux/features/mediaUpload/mediaUploadService.ts
import axios from "axios";
import * as FileSystem from "expo-file-system";
import {
  Media,
  PresignedUploadResponse,
  MediaMetadataRequest,
} from "./types";
import * as Mime from "react-native-mime-types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getPresignedUploadUrls = async (
  token: string
): Promise<PresignedUploadResponse> => {
  const response = await axios.post<PresignedUploadResponse>(
    `${API_BASE_URL}/api/media/upload-url`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const uploadFileToPresignedUrl = async (
  localUri: string,
  uploadUrl: string
): Promise<void> => {
  const mimeType = Mime.lookup(localUri) || "application/octet-stream";

  const uploadResult = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  if (uploadResult.status !== 200) {
    throw new Error(`Upload failed with status ${uploadResult.status}`);
  }
};

export const validateMetadata = async (
  token: string,
  metadataRequest: MediaMetadataRequest
): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/media/validate`, metadataRequest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadMetadata = async (
  token: string,
  metadata: MediaMetadataRequest
): Promise<Media> => {
  const response = await axios.post<Media>(
    `${API_BASE_URL}/api/media`,
    metadata,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
