import { DataSourceOptions, DataSource } from 'typeorm';
import { getEnvConfig } from './configurations';
import { User } from '../user/entity/user.entity';
import { Movie } from '../movie/entity/movie.entity';

const envConfig = getEnvConfig();

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: envConfig.mysql.host,
  port: envConfig.mysql.port,
  username: envConfig.mysql.username,
  password: envConfig.mysql.password,
  database: envConfig.mysql.database,
  entities: [User, Movie],
  synchronize: false,
};

// technical export to support manual migrations applying
export const dataSource = new DataSource({
  ...ormConfig,
  migrations: envConfig.isLocal
    ? ['src/database/migrations/**/*.ts']
    : ['dist/database/migrations/**/*.js'],
});
