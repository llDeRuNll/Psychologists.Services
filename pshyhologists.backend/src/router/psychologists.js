// src/routers/psychologists.js
import { Router } from 'express';
import {
  createPsychologistController,
  deletePsychologistController,
  getAllPsychologistsController,
  getPsychologistByIdController,
  upsertPsychologController,
  patchPsychologController,
} from '../controllers/psychologists.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  createPsychologistSchema,
  upsertPsychologistSchema,
} from '../validation/psychologist.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

// GET /
router.get('/', ctrlWrapper(getAllPsychologistsController));

// GET /:psychologistId
router.get(
  '/:psychologistId',
  isValidId,
  ctrlWrapper(getPsychologistByIdController),
);

// POST /
router.post(
  '/',
  validateBody(createPsychologistSchema),
  ctrlWrapper(createPsychologistController),
);
export default router;

//DELETE /:psychologistId
router.delete(
  '/:psychologistId',
  isValidId,
  ctrlWrapper(deletePsychologistController),
);

//PUT /:psychologistId
router.put(
  '/:psychologistId',
  isValidId,
  validateBody(upsertPsychologistSchema),
  ctrlWrapper(upsertPsychologController),
);

//Patch /:psychologistId
router.patch(
  '/:psychologistId',
  isValidId,
  validateBody(upsertPsychologistSchema),
  ctrlWrapper(patchPsychologController),
);
