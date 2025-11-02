//src/utils/parseFilterParams.js

export const extractNumber = (value) => {
  if (!value) return undefined;
  const match = String(value).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : undefined;
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseString = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return String(value);
};

export const parseFilterParams = (query) => {
  const {
    specialization,
    minExperience,
    maxExperience,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    license,
    initial_consultation,
  } = query;

  return {
    specialization: parseString(specialization),
    minExperience: parseNumber(minExperience),
    maxExperience: parseNumber(maxExperience),
    minPrice: parseNumber(minPrice),
    maxPrice: parseNumber(maxPrice),
    minRating: parseNumber(minRating),
    maxRating: parseNumber(maxRating),
    license: parseString(license),
    initial_consultation: parseString(initial_consultation),
  };
};
