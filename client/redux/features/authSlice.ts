import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth";
import { apiSlice } from "./apiSlice";

interface AuthState {
  user: User | null;
  sessionReady: boolean;
}

const initialState: AuthState = {
  user: null,
  sessionReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSessionReady: (state, action: PayloadAction<boolean>) => {
      state.sessionReady = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.sessionReady = true;
      })
      .addMatcher(apiSlice.endpoints.socialAuth.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.sessionReady = true;
      })
      .addMatcher(apiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(
        apiSlice.endpoints.updateUserInfo.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        },
      )
      .addMatcher(
        apiSlice.endpoints.updateProfilePicture.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        },
      )
      .addMatcher(
        apiSlice.endpoints.updatePassword.matchFulfilled,
        (state, action) => {
          if (action.payload.user) {
            state.user = action.payload.user;
          }
        },
      )
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, setSessionReady, logout } = authSlice.actions;
export default authSlice.reducer;
