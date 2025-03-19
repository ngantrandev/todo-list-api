import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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
