import express from 'express';
const apiRouter = express();

import authRouter from '@/routes/auth.routes';

apiRouter.use('/auth', authRouter);

export default apiRouter;
