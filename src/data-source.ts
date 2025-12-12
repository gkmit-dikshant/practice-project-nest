import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'emp_db',
  synchronize: process.env.SYNCHRONIZE === 'true',
  logging: false,
  entities: [__dirname + '/**/*.entity.js'],
  migrations: [__dirname + '/migrations/*.js'],
  subscribers: [],
});

export default AppDataSource;
