import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Employee } from '../employees/entities/employee.entity';
import { HttpException } from '@nestjs/common';

const mockDepartmentRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};
const mockEmployeeRepo = {
  findAndCount: jest.fn(),
};

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockDepartmentRepo,
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepo,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a department', async () => {
      const dto = { name: 'TEST' };
      const createdDepartment = { id: 1, ...dto };
      mockDepartmentRepo.create.mockReturnValue(createdDepartment);
      mockDepartmentRepo.save.mockResolvedValue(createdDepartment);

      const result = await service.create(dto);

      expect(mockDepartmentRepo.create).toHaveBeenCalledWith(dto);
      expect(mockDepartmentRepo.save).toHaveBeenCalledWith(createdDepartment);

      expect(result).toEqual(createdDepartment);
    });
  });

  describe('findAll', () => {
    it('should return all departments with pagination', async () => {
      const data = [{ id: 1, name: 'HR' }];
      const total = 1;
      mockDepartmentRepo.findAndCount.mockResolvedValue([data, total]);
      const result = await service.findAll(1, 10);

      expect(mockDepartmentRepo.findAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        data,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    describe('findOne', () => {
      it('should return a department by id', async () => {
        const data = { id: 1, name: 'HR' };

        mockDepartmentRepo.findOne.mockResolvedValue(data);
        const result = await service.findOne(1);

        expect(mockDepartmentRepo.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(result).toEqual(data);
      });

      it('should throw not found error', async () => {
        mockDepartmentRepo.findOne.mockResolvedValue(null);

        await expect(service.findOne(1)).rejects.toThrow(HttpException);
      });
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employee of department', async () => {
      const dept = { id: 1, name: 'HR' };
      const emps = [
        {
          id: 1,
          name: 'test user',
          email: 'test@email.com',
          contact: '9876543210',
          salary: '100000',
        },
      ];
      const total = 1;

      mockDepartmentRepo.findOne.mockResolvedValue(dept);
      mockEmployeeRepo.findAndCount.mockResolvedValue([emps, total]);

      const result = await service.getAllEmployees(1);

      expect(mockDepartmentRepo.findOne).toHaveBeenCalled();
      expect(mockEmployeeRepo.findAndCount).toHaveBeenCalled();

      expect(result).toEqual({
        data: emps,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});
