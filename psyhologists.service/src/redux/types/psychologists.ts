export type SortOrder = "asc" | "desc";

export interface Review {
  reviewer: string;
  rating: number;
  comment: string;
}

export interface Psychologist {
  id: string;
  _id?: string;
  name: string;
  avatar_url?: string;
  experience: string;
  price_per_hour: number;
  reviews: Review[];
  rating: number;
  license: string;
  specialization: string;
  initial_consultation?: string;
  about: string;
  ParentUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PsychologistsQuery {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  specialization?: string;
  license?: string;
  initial_consultation?: string;
  minExperience?: number;
  maxExperience?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
}

export interface Paginated<T> {
  data: T[];
  count: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type CreatePsychologistPayload = Omit<
  Psychologist,
  "id" | "_id" | "reviews" | "createdAt" | "updatedAt"
> & { reviews?: Review[] };

export type UpsertPsychologistPayload = Partial<CreatePsychologistPayload>;
