import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create({
      ...createEmployeeDto,
      department: { id: createEmployeeDto.departmentId },
    });

    return this.employeeRepo.save(employee);
  }

  async findAll(
    page = 1,
    limit = 10,
    sort: keyof Employee = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const [data, total] = await this.employeeRepo.findAndCount({
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
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: {
        department: true,
      },
    });

    if (!employee) {
      throw new HttpException(
        `Employee with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const exist = await this.employeeRepo.preload({ id, ...updateEmployeeDto });
    if (!exist) {
      throw new HttpException(
        `employee with id ${id} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.employeeRepo.save(exist);
    return { message: 'update successfully' };
  }

  async remove(id: number) {
    const exist = await this.employeeRepo.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(
        `employee with id ${id} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.employeeRepo.softDelete(id);
    return null;
  }
}
