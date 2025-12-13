import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepo.create(createDepartmentDto);
    return await this.departmentRepo.save(department);
  }

  async findAll(
    page = 1,
    limit = 10,
    sort: keyof Department = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const [data, total] = await this.departmentRepo.findAndCount({
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllEmployees(
    id: number,
    page = 1,
    limit = 10,
    sort: keyof Employee = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const department = await this.departmentRepo.findOne({ where: { id } });
    if (!department) {
      throw new HttpException(
        `Department with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const [data, total] = await this.employeeRepo.findAndCount({
      where: { department: { id } },
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const department = await this.departmentRepo.findOne({ where: { id } });

    if (!department) {
      throw new HttpException(
        `Department with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const exist = await this.departmentRepo.preload({
      id,
      ...updateDepartmentDto,
    });
    if (!exist) {
      throw new HttpException(
        `Department with id ${id} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }
    return exist;
  }

  async remove(id: number) {
    const exist = await this.departmentRepo.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(
        `Department with id ${id} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.departmentRepo.softDelete(id);
    return null;
  }
}
