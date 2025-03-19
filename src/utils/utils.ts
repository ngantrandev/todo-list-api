import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

import pool from '@/configs/db.config';

export const selectData = async (query: string, listParams: any[] = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, listParams, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const executeQuery = async (query: string, listParams: any[] = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, listParams, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  if (statusCode != StatusCodes.OK) {
    res.status(statusCode).json({
      success: false,
      message,
    });
  } else {
    res.status(statusCode).json({
      success: true,
      message,
      ...(data != null && { data }),
    });
  }
};

export const isValidInteger = (value: string) => {
  const trimmedValue = value.toString().trim();

  return (
    trimmedValue.length > 0 &&
    !isNaN(Number(trimmedValue)) &&
    Number.isInteger(Number(trimmedValue))
  );
};

export const hashPassWord = async (password: string) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const comparePassWord = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);

  return result;
};

export const generateJWT = (
  payload: string | Buffer | object,
  secretOrPrivateKey: string,
  options?: SignOptions
) => {
  const tokent = jwt.sign(payload, secretOrPrivateKey, options);

  return tokent;
};
