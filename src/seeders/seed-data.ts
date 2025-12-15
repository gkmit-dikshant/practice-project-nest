import { Department } from 'src/departments/entities/department.entity';
import { DataSource } from 'typeorm';

export async function seedData(dataSource: DataSource) {
  const departmentRepo = dataSource.getRepository(Department);

  const departments: Partial<Department>[] = [
    {
      name: 'hr',
    },
    {
      name: 'sales',
    },
    {
      name: 'marketing',
    },
    {
      name: 'devops',
    },
    {
      name: 'nodejs',
    },
  ];

  await departmentRepo.save(departments);
}
