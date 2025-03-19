import dotenv from 'dotenv';
import { StringValue } from 'ms';
dotenv.config();

const env = process.env;

const APP_PORT = env.APP_PORT || 3000;

const DB_PORT = env.DB_PORT;
const DB_HOST = env.DB_HOST;
const DB_USER = env.DB_USER;
const DB_PASS = env.DB_PASS;
const DB_NAME = env.DB_NAME;

const JWT_SECRET_KEY = env.JWT_SECRET_KEY as string;
const ACCESS_TOKEN_EXPIRES_IN = env.ACCESS_TOKEN_EXPIRES_IN as
  | StringValue
  | number;

if (!DB_PORT || !DB_HOST || !DB_USER || !DB_NAME) {
  throw new Error(
    'Missing database configuration. Please check your ".env" file.'
  );
}

if (!JWT_SECRET_KEY) {
  throw new Error('Missing JWT secret key. Please check your ".env" file.');
}

if (!ACCESS_TOKEN_EXPIRES_IN) {
  throw new Error(
    'Missing access token expiration time. Please check your ".env" file.'
  );
}

const envConfig = {
  APP_PORT: Number(APP_PORT),
  DB_PORT: Number(DB_PORT),
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
};

export default envConfig;
