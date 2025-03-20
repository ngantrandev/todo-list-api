import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import moment from 'moment-timezone';
import nodemailer from 'nodemailer';

import pool from '@/configs/db.config';
import envConfig from '@/configs/env.config';

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
      ...(data != null && { data }),
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

export const isValidDateTime = (date: string) => {
  return moment(date, 'YYYY-MM-DD HH:mm', true).isValid();
};

export const convertTimezoneVN = (date: string) => {
  return moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm');
};

export const generateRedisKey = (options: Object): string => {
  try {
    if (!options) {
      return 'UNDEFINED';
    }

    return Object.entries(options)
      .map(([key, value]) => `${key}:${value}`)
      .join(':');
  } catch (error) {
    return 'UNDEFINED';
  }
};

export const sendMail = async (
  email: string,
  subject: string,
  body: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: envConfig.EMAIL_HOST,
      auth: {
        user: envConfig.EMAIL_USER,
        pass: envConfig.EMAIL_PASS,
      },
    });

    const mailFrom = `Todo List Application <${envConfig.EMAIL_USER}>`;

    const mailOptions = {
      from: mailFrom,
      to: email,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error: any) {
    throw new Error(error);
  }
};
