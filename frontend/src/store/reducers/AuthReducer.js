import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@api";

const initialState = {
  auth: { authenticated: false, user: null },
  status: "idle", // idle | loading | authenticated | unauthenticated
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      if (response.data?.status === "SUCCESS") {
        return response.data.data;
      }
      return rejectWithValue(null);
    } catch (error) {
      console.log(error);
      return rejectWithValue(null);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.auth = initialState.auth;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.status = "authenticated";
      state.auth = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.status = "unauthenticated";
      state.auth = initialState.auth;
    });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
