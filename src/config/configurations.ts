import { config } from 'dotenv';
import { join } from 'path';

config();

export const getEnvConfig = () => ({
  port: parseInt(process.env.PORT) || 3001,
  mysql: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 3001,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '1',
    database: process.env.DATABASE || 'mydb',
    entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  },
  youtube: {
    youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  },
  isLocal: (process.env.NODE_ENV || 'local') === 'local',
});

export const getGeneralConfig = () => ({
  envConfig: getEnvConfig(),
});
