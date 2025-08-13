// redux/features/mediaUpload/mediaUploadSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { uploadMediaThunk } from "./mediaUploadThunks";
import { MediaItem } from "./types";
import Toast from "react-native-toast-message";

interface MediaUploadState {
  status: "idle" | "uploading" | "succeeded" | "failed";
  error: string | null;
  uploadedMedia: MediaItem | null;
}

const initialState: MediaUploadState = {
  status: "idle",
  error: null,
  uploadedMedia: null,
};

const mediaUploadSlice = createSlice({
  name: "mediaUpload",
  initialState,
  reducers: {
    resetMediaUploadState: (state) => {
      state.status = "idle";
      state.error = null;
      state.uploadedMedia = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ───── START ─────
      .addCase(uploadMediaThunk.pending, (state) => {
        state.status = "uploading";
        state.error = null;
        state.uploadedMedia = null;

        Toast.show({
          type: "info",
          text1: "Uploading media...",
        });
      })

      // ───── SUCCESS ─────
      .addCase(uploadMediaThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uploadedMedia = action.payload;
        // console.log("Media uploaded successfully:", action.payload);

        Toast.hide(); // Hide previous
        Toast.show({
          type: "success",
          text1: "Upload complete!",
        });
      })

      // ───── ERROR ─────
      .addCase(uploadMediaThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;

        Toast.hide(); // Hide previous
        if (action.payload && typeof action.payload === "object") {
          const entries = Object.entries(action.payload);
          entries.forEach(([key, value], idx) => {
            setTimeout(() => {
              Toast.show({
                type: "error",
                text1: `Upload failed: ${key}`,
                text2: String(value),
                visibilityTime: 5000, 
              });
            }, idx * 5100); 
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Upload failed",
            text2: state.error || "Something went wrong",
            visibilityTime: 2000, // 2 seconds
          });
        }
      });
  },
});

export const { resetMediaUploadState } = mediaUploadSlice.actions;
export default mediaUploadSlice.reducer;
