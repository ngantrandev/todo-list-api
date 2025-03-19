import { NextFunction, Request, Response } from 'express';

import { logger } from '@/configs/logger.config';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      message: 'Request received',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
