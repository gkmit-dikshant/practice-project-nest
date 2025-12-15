import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { seedData } from './seed-data';

async function runSeeder() {
  try {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    await seedData(dataSource);
    await app.close();
  } catch (error) {
    console.error('failed to seed data', error);
  }
}

runSeeder();
