import type { RootState } from "../store";

export const selectIsAuth = (s: RootState) => Boolean(s.auth.accessToken);
export const selectUser = (s: RootState) => s.auth.user;
export const selectAuthLoading = (s: RootState) => s.auth.loading;
export const selectAuthError = (s: RootState) => s.auth.error;
