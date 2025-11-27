import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  Paginated,
  Psychologist,
  PsychologistsQuery,
  CreatePsychologistPayload,
  UpsertPsychologistPayload,
} from "../types/psychologists";
import { API } from "../../axiosConfig/api";

export const fetchPsychologists = createAsyncThunk<
  Paginated<Psychologist>,
  PsychologistsQuery,
  { rejectValue: string }
>("psychologists/fetchAll", async (query, { rejectWithValue }) => {
  try {
    const { data } = await API.get<Paginated<Psychologist>>("/psychologists", {
      params: query,
    });
    return data;
  } catch {
    return rejectWithValue("cannot fetch psychologists list");
  }
});

// One by id
export const fetchPsychologistById = createAsyncThunk<
  Psychologist,
  string,
  { rejectValue: string }
>("psychologists/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get<{ data: Psychologist }>(
      `/psychologists/${id}`
    );
    return data.data;
  } catch {
    return rejectWithValue("psychologist not found");
  }
});

export const createPsychologist = createAsyncThunk<
  Psychologist,
  CreatePsychologistPayload | FormData,
  { rejectValue: string }
>("psychologists/create", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post<{ data: Psychologist }>(
      `/psychologists`,
      body,
      {
        headers:
          body instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      }
    );
    return data.data;
  } catch {
    return rejectWithValue("cannot create psychologist");
  }
});

// Put
export const putPsychologist = createAsyncThunk<
  Psychologist,
  { id: string; body: UpsertPsychologistPayload | FormData },
  { rejectValue: string }
>("psychologists/put", async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await API.put<{ data: Psychologist }>(
      `/psychologists/${id}`,
      body,
      {
        headers:
          body instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      }
    );
    return data.data;
  } catch {
    return rejectWithValue("cannot update data (PUT)");
  }
});

// Patch
export const patchPsychologist = createAsyncThunk<
  Psychologist,
  { id: string; body: UpsertPsychologistPayload | FormData },
  { rejectValue: string }
>("psychologists/patch", async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await API.patch<{ data: Psychologist }>(
      `/psychologists/${id}`,
      body,
      {
        headers:
          body instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      }
    );
    return data.data;
  } catch {
    return rejectWithValue("cannot update data (PATCH)");
  }
});

// Delete
export const deletePsychologist = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("psychologists/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/psychologists/${id}`);
    return id;
  } catch {
    return rejectWithValue("cannot delete psychologist");
  }
});
