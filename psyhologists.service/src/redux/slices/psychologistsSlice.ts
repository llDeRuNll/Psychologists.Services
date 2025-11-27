import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Paginated,
  Psychologist,
  PsychologistsQuery,
} from "../types/psychologists";
import {
  createPsychologist,
  deletePsychologist,
  fetchPsychologistById,
  fetchPsychologists,
  patchPsychologist,
  putPsychologist,
} from "../operations/psychologists";

type LoadingState = {
  list: boolean;
  item: boolean;
  mutate: boolean;
};

type PaginationState = Omit<Paginated<unknown>, "data">;

type PsychologistsState = {
  list: Psychologist[];
  item: Psychologist | null;
  loading: LoadingState;
  error: string | null;
  pagination: PaginationState;
  lastQuery: PsychologistsQuery;
};

const initialState: PsychologistsState = {
  list: [],
  item: null,
  loading: { list: false, item: false, mutate: false },
  error: null,
  pagination: {
    count: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  lastQuery: {},
};

const slice = createSlice({
  name: "psychologists",
  initialState,
  reducers: {
    setLastQuery(state, action: PayloadAction<PsychologistsQuery>) {
      state.lastQuery = action.payload;
    },

    clearCurrent(state) {
      state.item = null;
      state.error = null;
      state.loading.item = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPsychologists.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;
      state.list = data;
      state.pagination = pagination;
      state.loading.list = false;
      state.error = null;
    });

    builder.addCase(fetchPsychologistById.fulfilled, (state, action) => {
      state.item = action.payload;
      state.loading.item = false;
      state.error = null;
    });

    const upsertFulfilled = (
      state: PsychologistsState,
      payload: Psychologist
    ) => {
      const idx = state.list.findIndex(
        (p) => p.id === payload.id || p._id === payload._id
      );
      if (idx >= 0) state.list[idx] = payload;
      else state.list.unshift(payload);
      state.item = payload;
      state.loading.mutate = false;
      state.error = null;
    };

    builder.addCase(createPsychologist.fulfilled, (s, a) =>
      upsertFulfilled(s, a.payload)
    );
    builder.addCase(putPsychologist.fulfilled, (s, a) =>
      upsertFulfilled(s, a.payload)
    );
    builder.addCase(patchPsychologist.fulfilled, (s, a) =>
      upsertFulfilled(s, a.payload)
    );

    builder.addCase(deletePsychologist.fulfilled, (state, action) => {
      state.list = state.list.filter(
        (p) => p.id !== action.payload && p._id !== action.payload
      );
      if (
        state.item &&
        (state.item.id === action.payload || state.item._id === action.payload)
      ) {
        state.item = null;
      }
      state.loading.mutate = false;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(fetchPsychologists.pending), (state) => {
      state.loading.list = true;
      state.error = null;
    });
    builder.addMatcher(isAnyOf(fetchPsychologistById.pending), (state) => {
      state.loading.item = true;
      state.error = null;
    });
    builder.addMatcher(
      isAnyOf(
        createPsychologist.pending,
        putPsychologist.pending,
        patchPsychologist.pending,
        deletePsychologist.pending
      ),
      (state) => {
        state.loading.mutate = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(fetchPsychologists.rejected, fetchPsychologistById.rejected),
      (state, action) => {
        state.loading.list = false;
        state.loading.item = false;
        state.error = action.payload
          ? String(action.payload)
          : action.error.message ?? "error request";
      }
    );

    builder.addMatcher(
      isAnyOf(
        createPsychologist.rejected,
        putPsychologist.rejected,
        patchPsychologist.rejected,
        deletePsychologist.rejected
      ),
      (state, action) => {
        state.loading.mutate = false;
        state.error = action.payload
          ? String(action.payload)
          : action.error.message ?? "error request";
      }
    );
  },
});

export const { setLastQuery, clearCurrent } = slice.actions;
export default slice.reducer;
