import dotenv from 'dotenv';
import { StringValue } from 'ms';
dotenv.config();

const env = process.env;

const APP_PORT = env.APP_PORT;

const DB_PORT = env.DB_PORT;
const DB_HOST = env.DB_HOST;
const DB_USER = env.DB_USER;
const DB_PASS = env.DB_PASS;
const DB_NAME = env.DB_NAME;

const EMAIL_HOST = env.EMAIL_HOST;
const EMAIL_USER = env.EMAIL_USER;
const EMAIL_PASS = env.EMAIL_PASS;

const REDIS_PORT = env.REDIS_PORT;
const REDIS_HOST = env.REDIS_HOST;

const JWT_SECRET_KEY = env.JWT_SECRET_KEY as string;
const ACCESS_TOKEN_EXPIRES_IN = env.ACCESS_TOKEN_EXPIRES_IN as
  | StringValue
  | number;

if (!APP_PORT) {
  throw new Error('Missing application port. Please check your ".env" file.');
}

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

if (!REDIS_PORT) {
  throw new Error('Missing Redis port. Please check your ".env" file.');
}

if (!REDIS_HOST) {
  throw new Error('Missing Redis host. Please check your ".env" file.');
}

// if (!EMAIL_HOST) {
//   throw new Error('Missing email host. Please check your ".env" file.');
// }

// if (!EMAIL_USER) {
//   throw new Error('Missing email user. Please check your ".env" file.');
// }

// if (!EMAIL_PASS) {
//   throw new Error('Missing email password. Please check your ".env" file.');
// }

const envConfig = {
  APP_PORT: Number(APP_PORT),
  DB_PORT: Number(DB_PORT),
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REDIS_PORT: Number(REDIS_PORT),
  REDIS_HOST,
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_PASS,
};

export default envConfig;
