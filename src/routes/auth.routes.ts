import express from 'express';
const authRouter = express.Router();

import { signup, signin } from '@/controllers/auth.controllers';

authRouter.post('/signup', signup);

authRouter.post('/signin', signin);

export default authRouter;
