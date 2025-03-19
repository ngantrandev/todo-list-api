import express from 'express';
const apiRouter = express();

import {
  verifyCurrentUser,
  verifyToken,
} from '@/middlewares/verify.middleware';
import authRouter from '@/routes/auth.routes';
import userRouter from '@/routes/user.routes';

apiRouter.use('/auth', authRouter);

apiRouter.use('/users/:user_id', verifyToken, verifyCurrentUser, userRouter);

export default apiRouter;
