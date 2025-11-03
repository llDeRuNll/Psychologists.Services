//src/router/index.js

import { Router } from 'express';
import psychologistsRouter from './psychologists.js';
import authRouter from './auth.js';

const router = Router();

router.use('/psychologists', psychologistsRouter);
router.use('/auth', authRouter);

export default router;
