import express, { Request, Response } from 'express';

import envConfig from '@/configs/env.config';
import { loggerMiddleware } from '@/middlewares/logger.middleware';
import apiRouter from '@/routes/api.routes';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Todo List API',
  });
});

app.use('/api/v1', apiRouter);

app.listen(envConfig.APP_PORT, () => {
  console.log('Server is running on port ' + envConfig.APP_PORT);
});

export default app;
