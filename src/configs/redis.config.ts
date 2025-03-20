import * as redis from 'redis';
import { RedisClientType } from '@redis/client';

import envConfig from '@/configs/env.config';

const client: RedisClientType = redis.createClient({
  socket: {
    host: envConfig.REDIS_HOST,
    port: envConfig.REDIS_PORT,
  },
});

client.on('error', (error) => {
  console.error(`Error when connect to redis : ${error}`);
});

client.on('connect', () => {
  console.log('connected to redis');
});

(async () => {
  await client.connect();
})();

export default client;
