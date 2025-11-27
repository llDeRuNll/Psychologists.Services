import {
  createSlice,
  isAnyOf,
  isRejectedWithValue,
  isRejected,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getMe, login, logout, refresh, register } from "../operations/auth";
import type { User, TokensResponse } from "../operations/auth";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  user: null,
  loading: false,
  error: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<TokensResponse>) => {
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      }
    );

    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<TokensResponse>) => {
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      }
    );

    builder.addCase(
      refresh.fulfilled,
      (state, action: PayloadAction<TokensResponse>) => {
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      }
    );

    builder.addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.accessToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    });

    builder.addMatcher(
      isAnyOf(
        login.pending,
        register.pending,
        refresh.pending,
        getMe.pending,
        logout.pending
      ),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isRejectedWithValue(login, register, refresh, getMe, logout),
      (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? "Request error");
      }
    );

    builder.addMatcher(
      isRejected(login, register, refresh, getMe, logout),
      (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Something went wrong";
      }
    );
  },
});

export default authReducer.reducer;
