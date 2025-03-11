import { DataSourceOptions, DataSource } from 'typeorm';
import { getEnvConfig } from './configurations';

const envConfig = getEnvConfig();

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: envConfig.mysql.host,
  port: envConfig.mysql.port,
  username: envConfig.mysql.username,
  password: envConfig.mysql.password,
  database: envConfig.mysql.database,
  entities: envConfig.mysql.entities,
  synchronize: false,
};

// technical export to support manual migrations applying
export const dataSource = new DataSource({
  ...ormConfig,
  migrations: envConfig.isLocal
    ? ['src/database/migrations/**/*.ts']
    : ['dist/database/migrations/**/*.js'],
});
