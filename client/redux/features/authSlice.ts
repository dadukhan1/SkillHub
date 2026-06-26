import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth";
import { apiSlice } from "./apiSlice";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(apiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
