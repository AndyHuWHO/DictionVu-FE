// redux/features/mediaUpload/mediaUploadService.ts
import axios from "axios";
import { File } from "expo-file-system";
import {
  InitiateMediaUploadRequest,
  MediaItem,
  PresignedUploadResponse,
  MediaMetadataRequest,
} from "./types";
import * as Mime from "react-native-mime-types";
import { fetch } from "expo/fetch"; 

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


export const initiateMediaUpload = async (
  token: string,
  request: InitiateMediaUploadRequest
): Promise<PresignedUploadResponse> => {
  const response = await axios.post<PresignedUploadResponse>(
    `${API_BASE_URL}/api/media/upload/initiate`,
    request,
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
  const file = new File(localUri);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    body: file, 
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
};


export const uploadMetadata = async (
  token: string,
  metadata: MediaMetadataRequest
): Promise<MediaItem> => {
  const response = await axios.post<MediaItem>(
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
