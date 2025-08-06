// redux/features/mediaUpload/types.ts
export interface MediaMetadata {
  description: string;
  words: string[];
  tags: string[];
  durationSeconds: number;
  fileSizeBytes: number;
  visibility: "PUBLIC" | "PRIVATE";
}

export interface LocalUris {
  contentUri: string;
  thumbnailUri: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  objectKey: string;
  thumbnailUploadUrl: string;
  thumbnailKey: string;
}

export interface MediaMetadataRequest {
  objectKey: string;
  thumbnailKey: string;
  description: string;
  words: string[];
  tags: string[];
  durationSeconds: number;
  fileSizeBytes: number;
  visibility: "PUBLIC" | "PRIVATE";
}

export interface Media {
  id: string;
  authUserId: string;
  objectPresignedGetUrl: string;
  thumbnailPresignedGetUrl: string;
  description: string;
  words: string[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  durationSeconds: number;
  fileSizeBytes: number;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
}

