// redux/features/mediaUpload/mediaUploadThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Mime from "react-native-mime-types";
import {
  initiateMediaUpload,
  uploadFileToPresignedUrl,
  uploadMetadata,
} from "./mediaUploadService";
import {
  InitiateMediaUploadRequest,
  MediaItem,
  MediaMetadata,
  LocalUris,
  MediaMetadataRequest,
} from "./types";
import { RootState } from "../../store";
import { addMediaItemToFeed } from "@/redux/features/mediaFeed/mediaFeedSlice";
import { addMediaToWords } from "@/redux/features/mediaWord/mediaWordSlice";

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

    const videoContentType = Mime.lookup(localUris.contentUri) || "video/mp4";

    // Step 1: Backend validates metadata and generates URLs.
    const initiationRequest: InitiateMediaUploadRequest = {
      ...metadata,
      videoContentType,
    };

    const presigned = await initiateMediaUpload(token, initiationRequest);

    // Step 2: Upload video and thumbnail to S3
    await uploadFileToPresignedUrl(localUris.contentUri, presigned.uploadUrl);
    await uploadFileToPresignedUrl(
      localUris.thumbnailUri,
      presigned.thumbnailUploadUrl,
    );

    const metadataRequest: MediaMetadataRequest = {
      ...metadata,
      objectKey: presigned.objectKey,
      thumbnailKey: presigned.thumbnailKey,
    };

    // Step 3: Upload metadata
    const savedMedia = await uploadMetadata(token, metadataRequest);

    // Add to media feed immediately
    thunkAPI.dispatch(addMediaItemToFeed(savedMedia));
    thunkAPI.dispatch(addMediaToWords(savedMedia));

    return savedMedia;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || error.message || "Unknown error",
    );
  }
});
