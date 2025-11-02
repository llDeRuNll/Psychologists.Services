// src/services/psychologists.js

import { SORT_ORDER } from '../constans/index.js';
import { PsychologistsCollection } from '../db/models/psychologists.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { extractNumber } from '../utils/parseFilterParams.js';

export const getAllPsychologists = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
} = {}) => {
  const mongoQuery = PsychologistsCollection.find();

  if (filter.specialization) {
    if (filter.specialization.includes(',')) {
      mongoQuery
        .where('specialization')
        .in(filter.specialization.split(',').map((s) => s.trim()));
    } else {
      mongoQuery.where('specialization').equals(filter.specialization);
    }
  }

  if (filter.minPrice !== undefined) {
    mongoQuery.where('price_per_hour').gte(filter.minPrice);
  }
  if (filter.maxPrice !== undefined) {
    mongoQuery.where('price_per_hour').lte(filter.maxPrice);
  }

  if (filter.minRating !== undefined) {
    mongoQuery.where('rating').gte(filter.minRating);
  }
  if (filter.maxRating !== undefined) {
    mongoQuery.where('rating').lte(filter.maxRating);
  }

  if (filter.license) {
    mongoQuery.where('license').equals(filter.license);
  }

  if (filter.initial_consultation) {
    mongoQuery.where('initial_consultation', {
      $regex: filter.initial_consultation,
      $options: 'i',
    });
  }

  const all = await mongoQuery.sort({ [sortBy]: sortOrder }).exec();

  const withExpFilter = all.filter((item) => {
    const exp = extractNumber(item.experience);

    if (filter.minExperience !== undefined && exp < filter.minExperience) {
      return false;
    }
    if (filter.maxExperience !== undefined && exp > filter.maxExperience) {
      return false;
    }
    return true;
  });

  const total = withExpFilter.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = withExpFilter.slice(start, end);

  const paginationData = calculatePaginationData(total, perPage, page);

  return {
    data: paginated,
    ...paginationData,
  };
};

export const getPsychologistById = async (psychologistId) => {
  const psychologist = await PsychologistsCollection.findById(psychologistId);
  return psychologist;
};

export const createPsychologist = async (payload) => {
  const psychologist = await PsychologistsCollection.create(payload);
  return psychologist;
};

export const deletePsychologist = async (psychologistId) => {
  const psychologist = await PsychologistsCollection.findOneAndDelete({
    _id: psychologistId,
  });
  return psychologist;
};

export const upsertPsycholog = async (
  psychologistId,
  payload,
  options = {},
) => {
  const rawResult = await PsychologistsCollection.findByIdAndUpdate(
    psychologistId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  if (!rawResult) return null;

  return {
    psychologist: rawResult,
    isNew: false,
  };
};
