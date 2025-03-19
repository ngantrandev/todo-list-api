import express from 'express';
const userRouter = express();

import taskRouter from '@/routes/task.routes';

userRouter.use('/tasks', taskRouter);

export default userRouter;
