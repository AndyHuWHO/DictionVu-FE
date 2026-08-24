// redux/features/mediaUpload/types.ts
export interface MediaMetadata {
  description: string;
  words: string[];
  tags: string[];
  durationSeconds: number;
  fileSizeBytes: number;
  visibility: "PUBLIC" | "PRIVATE";
}

export interface InitiateMediaUploadRequest extends MediaMetadata {
  videoContentType: string;
}

export interface MediaMetadataRequest extends MediaMetadata {
  objectKey: string;
  thumbnailKey: string;
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


export interface MediaItem {
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

export interface MediaPagedResponse {
  content: MediaItem[];
  page: number;
  pageSize: number;
  totalPages: number;
}

