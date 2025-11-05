// src/controllers/psychologists.js
import createHttpError from 'http-errors';
import {
  createPsychologist,
  deletePsychologist,
  getAllPsychologists,
  getPsychologistById,
  upsertPsycholog,
} from '../services/psychologists.js';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllPsychologistsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const result = await getAllPsychologists({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found psychologists!',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getPsychologistByIdController = async (req, res, next) => {
  const { psychologistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(psychologistId)) {
    throw createHttpError(400, 'Invalid psychologist id');
  }

  const psychologist = await getPsychologistById(psychologistId);

  if (!psychologist) {
    throw createHttpError(404, 'Psychologist not found');
  }

  res.json({
    status: 200,
    message: `Successfully found psychologist with id ${psychologistId}!`,
    data: psychologist,
  });
};

export const createPsychologistController = async (req, res) => {
  const psychologist = await createPsychologist(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a Psychologist!`,
    data: psychologist,
  });
};

export const deletePsychologistController = async (req, res) => {
  const { psychologistId } = req.params;
  const psychologist = await deletePsychologist(psychologistId);
  if (!psychologist) {
    throw createHttpError(404, 'Psychologist not found');
  }
  res.status(204).send();
};

export const upsertPsychologController = async (req, res) => {
  const { psychologistId } = req.params;

  const result = await upsertPsycholog(psychologistId, req.body, {
    upsert: true,
  });
  if (!result) throw createHttpError(404, 'Psychologist not found');

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a psychologist!`,
    data: result.psychologist,
  });
};

export const patchPsychologController = async (req, res, next) => {
  const { psychologistId } = req.params;
  const photo = req.file;

  let avatar_url;
  if (photo) {
    avatar_url = await saveFileToUploadDir(photo);
  }

  const result = await upsertPsycholog(psychologistId, req.body, {
    photo: avatar_url,
  });
  if (!result) throw createHttpError(404, 'Psychologist not found');

  res.status(200).json({
    status: 200,
    message: `Successfully patched psychologist with id ${psychologistId}!`,
    data: result.psychologist,
  });
};
