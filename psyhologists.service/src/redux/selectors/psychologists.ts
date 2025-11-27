import type { RootState } from "../store";

export const selectPsychologists = (s: RootState) => s.psychologists.list;
export const selectPsychologist = (s: RootState) => s.psychologists.item;

export const selectPsyLoadingList = (s: RootState) =>
  s.psychologists.loading.list;
export const selectPsyLoadingItem = (s: RootState) =>
  s.psychologists.loading.item;
export const selectPsyLoadingMutate = (s: RootState) =>
  s.psychologists.loading.mutate;

export const selectPsyError = (s: RootState) => s.psychologists.error;

export const selectPsyPagination = (s: RootState) => s.psychologists.pagination;
export const selectPsyLastQuery = (s: RootState) => s.psychologists.lastQuery;
