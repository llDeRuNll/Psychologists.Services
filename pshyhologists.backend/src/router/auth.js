// src/router/auth.js

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { registerSchema } from '../validation/auth';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { registerUserController } from '../controllers/auth';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

export default router;
