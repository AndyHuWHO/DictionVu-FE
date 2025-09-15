import { createSlice } from "@reduxjs/toolkit";

const videoPlayerCrashSlice = createSlice({
  name: "videoPlayerCrash",
  initialState: {
    hasCrashed: 0,
  },
  reducers: {
    reportCrash: (state) => {
      state.hasCrashed += 1;
    },
    resetCrash: (state) => {
      state.hasCrashed = 0;
    },
  },
});

export const { reportCrash, resetCrash } = videoPlayerCrashSlice.actions;

export default videoPlayerCrashSlice.reducer;
