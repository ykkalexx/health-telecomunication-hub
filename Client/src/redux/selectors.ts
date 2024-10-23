import { RootState } from "./root";

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserId = (state: RootState) => state.auth.user?.id;
export const selectUserHealthInfo = (state: RootState) =>
  state.auth.user?.healthInfo;
export const selectUserUsername = (state: RootState) =>
  state.auth.user?.username;
