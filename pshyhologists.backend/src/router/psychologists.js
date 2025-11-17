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
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constans/index.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

// GET /
router.get('/', ctrlWrapper(getAllPsychologistsController));

// GET /:psychologistId
router.get(
  '/:psychologistId',
  isValidId,
  checkRoles(ROLES.CLIENT),
  ctrlWrapper(getPsychologistByIdController),
);

// POST /
router.post(
  '/',
  checkRoles(ROLES.PSYCHOLOGIST),
  upload.single('avatar'),
  validateBody(createPsychologistSchema),
  ctrlWrapper(createPsychologistController),
);

//DELETE /:psychologistId
router.delete(
  '/:psychologistId',
  isValidId,
  checkRoles(ROLES.PSYCHOLOGIST),
  ctrlWrapper(deletePsychologistController),
);

//PUT /:psychologistId
router.put(
  '/:psychologistId',
  isValidId,
  upload.single('avatar'),
  checkRoles(ROLES.PSYCHOLOGIST),
  validateBody(upsertPsychologistSchema),
  ctrlWrapper(upsertPsychologController),
);

//Patch /:psychologistId
router.patch(
  '/:psychologistId',
  isValidId,
  upload.single('avatar'),
  checkRoles(ROLES.PSYCHOLOGIST),
  validateBody(upsertPsychologistSchema),
  ctrlWrapper(patchPsychologController),
);
export default router;
