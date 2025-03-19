import { NextFunction, Response } from 'express';
import { CustomRequest } from '@/types/requests';
import { StatusCodes } from 'http-status-codes';

import jwt from 'jsonwebtoken';

import { isValidInteger, selectData, sendResponse } from '@/utils/utils';
import { User } from '@/types/models';
import envConfig from '@/configs/env.config';

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.token as string | undefined;

  if (token) {
    const accessToken = token.trim().split(' ')[1]; // remove "Bearer" from token

    if (!envConfig.JWT_SECRET_KEY) {
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Token secret is not defined'
      );
      return;
    }

    jwt.verify(
      accessToken,
      envConfig.JWT_SECRET_KEY,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          sendResponse(res, StatusCodes.FORBIDDEN, 'Token is not valid');
          return;
        }
        req.tokenPayload = decoded;
        next();
      }
    );
  } else {
    sendResponse(res, StatusCodes.UNAUTHORIZED, 'Token is not provided');
  }
};

export const verifyCurrentUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.user_id) {
    sendResponse(res, StatusCodes.BAD_REQUEST, 'missing user_id param');

    return;
  }

  if (!isValidInteger(req.params.user_id)) {
    sendResponse(res, StatusCodes.BAD_REQUEST, 'user id must be interger');
    return;
  }

  const query = `SELECT * FROM users WHERE id = ?`;
  const users: User[] = (await selectData(query, [
    req.params.user_id,
  ])) as User[];

  // not found this user with id
  if (users.length === 0) {
    sendResponse(res, StatusCodes.NOT_FOUND, 'not found this user');
    return;
  }

  // difference user
  if (users[0].id != req.tokenPayload.user_id) {
    sendResponse(
      res,
      StatusCodes.FORBIDDEN,
      'You are not allowed to do this action'
    );
    return;
  }

  next();
};
