import { createPool, PoolOptions } from 'mysql2';

import envConfig from '@/configs/env.config';

const accessOptions: PoolOptions = {
  port: envConfig.DB_PORT,
  host: envConfig.DB_HOST,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASS,
  database: envConfig.DB_NAME,
  connectionLimit: 10,
};

const pool = createPool(accessOptions);

pool.on('success', () => {
  console.log('Connected to database successfully');
});

// Xử lý sự kiện lỗi cho kết nối sau này
pool.on('error', (err: NodeJS.ErrnoException) => {
  console.error('Missing database connection ', err);
});

// create connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database: ', err.message);
  } else {
    console.log('Connected to database successfully');
  }
});

export default pool;
