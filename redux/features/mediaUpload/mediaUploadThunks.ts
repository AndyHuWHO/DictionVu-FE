// redux/features/mediaUpload/mediaUploadThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPresignedUploadUrls,
  uploadFileToPresignedUrl,
  validateMetadata,
  uploadMetadata,
} from "./mediaUploadService";
import {
  MediaItem,
  MediaMetadata,
  LocalUris,
  MediaMetadataRequest,
} from "./types";
import { RootState } from "../../store";
import { addMediaItemToFeed } from "@/redux/features/mediaFeed/mediaFeedSlice";

// Input to the thunk
interface UploadMediaParams {
  metadata: MediaMetadata;
  localUris: LocalUris;
}

// Output from the thunk
export const uploadMediaThunk = createAsyncThunk<
  MediaItem, // return type
  UploadMediaParams, // thunk arg type
  { state: RootState }
>("mediaUpload/uploadMedia", async ({ metadata, localUris }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    if (!token) {
      throw new Error("User not authenticated.");
    }

    // Step 1: Get presigned upload URLs
    const presigned = await getPresignedUploadUrls(token);

    // Step 2: Validate metadata
    const validationRequest: MediaMetadataRequest = {
      ...metadata,
      objectKey: presigned.objectKey,
      thumbnailKey: presigned.thumbnailKey,
    };

    await validateMetadata(token, validationRequest);

    // Step 3: Upload video and thumbnail to S3
    await uploadFileToPresignedUrl(localUris.contentUri, presigned.uploadUrl);
    await uploadFileToPresignedUrl(
      localUris.thumbnailUri,
      presigned.thumbnailUploadUrl
    );

    // Step 4: Upload metadata
    const savedMedia = await uploadMetadata(token, validationRequest);

    // Add to media feed immediately
    thunkAPI.dispatch(addMediaItemToFeed(savedMedia));

    return savedMedia;
  } catch (error: any) {
    console.error("Upload failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
});
