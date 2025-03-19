import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomRequest } from '@/types/requests';
import { User } from '@/types/models';

import {
  selectData,
  hashPassWord,
  executeQuery,
  sendResponse,
  comparePassWord,
  generateJWT,
} from '@/utils/utils';
import { UserResponse } from '@/types/responses';
import envConfig from '@/configs/env.config';

export const signup = async (req: CustomRequest, res: Response) => {
  try {
    const requiredFields = ['username', 'password', 'email'];

    for (const field of requiredFields) {
      if (field === 'email') {
        continue;
      }
      if (!req.body[field]) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          `Missing required field: ${field}`
        );
        return;
      }
    }

    const selectQuery = `SELECT * FROM users WHERE username = ?`;

    const users: User[] = (await selectData(selectQuery, [
      req.body.username,
    ])) as User[];

    if (users.length > 0) {
      sendResponse(res, StatusCodes.CONFLICT, 'This username already exists!');
      return;
    }

    /* CREATE USER */

    const fields = requiredFields.map((field) => ` ${field}`);

    const query = `INSERT INTO users (${fields.join(',')}) VALUES (?, ?, ?)`;

    const values = [];

    for (const field of requiredFields) {
      const value = req.body[field];
      if (field === 'password') {
        const hash = await hashPassWord(value);
        values.push(hash);
      } else {
        values.push(value);
      }
    }

    const result = await executeQuery(query, values);

    if (!result) {
      sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'cannot create account at this time!'
      );

      return;
    }

    sendResponse(res, StatusCodes.OK, 'Created account successfully!');
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'something went wrong!' + error
    );
  }
};

export const signin = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body.username) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'Missing username');
      return;
    }

    if (!req.body.password) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'Missing password');
      return;
    }

    const { username: formUsername, password: formPassword } = req.body;

    const query = `
      SELECT * FROM users WHERE username = ?`;

    const users: UserResponse[] = (await selectData(query, [
      formUsername,
    ])) as UserResponse[];

    if (users.length === 0) {
      sendResponse(res, StatusCodes.NOT_FOUND, 'Wrong username or password');

      return;
    }

    const userPassword = users[0].password;

    if (!userPassword) {
      sendResponse(res, StatusCodes.NOT_FOUND, 'Wrong username or password');

      return;
    }

    const result = await comparePassWord(formPassword, userPassword);

    if (!result) {
      sendResponse(res, StatusCodes.NOT_FOUND, 'Wrong username or password');

      return;
    }

    const { password, ...other } = users[0];

    const token = generateJWT(
      {
        user_id: users[0].user_id,
        username: formUsername,
      },
      envConfig.JWT_SECRET_KEY,
      {
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Sign in successfully!',
      access_token: token,
      data: other,
    });
  } catch (error: any) {
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};
