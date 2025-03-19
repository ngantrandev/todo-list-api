import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

const APP_PORT = env.APP_PORT || 3000;

const DB_PORT = env.DB_PORT;
const DB_HOST = env.DB_HOST;
const DB_USER = env.DB_USER;
const DB_PASS = env.DB_PASS;
const DB_NAME = env.DB_NAME;

if (!DB_PORT || !DB_HOST || !DB_USER || !DB_NAME) {
  throw new Error(
    'Missing database configuration. Please check your ".env" file.'
  );
}

const envConfig = {
  APP_PORT: Number(APP_PORT),
  DB_PORT: Number(DB_PORT),
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
};

export default envConfig;
