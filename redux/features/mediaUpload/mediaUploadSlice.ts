// redux/features/mediaUpload/mediaUploadSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { uploadMediaThunk } from "./mediaUploadThunk";
import { Media } from "./types";
import Toast from "react-native-toast-message";

interface MediaUploadState {
  status: "idle" | "uploading" | "succeeded" | "failed";
  error: string | null;
  uploadedMedia: Media | null;
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
        Toast.show({
          type: "error",
          text1: "Upload failed",
          text2: state.error || "Something went wrong",
        });
      });
  },
});

export const { resetMediaUploadState } = mediaUploadSlice.actions;
export default mediaUploadSlice.reducer;
