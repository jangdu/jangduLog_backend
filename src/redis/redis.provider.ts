import { createClient } from 'redis';

export const redisProvider = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const client = createClient({
        url: 'redis://127.0.0.1:6379',
      });
      await client.connect();
      return client;
    },
  },
];
