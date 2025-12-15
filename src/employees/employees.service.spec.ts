import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

const mockEmployeeRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('EmployeesService', () => {
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepo,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an employee', async () => {
      const dto = {
        name: 'John',
        email: 'john@email.com',
        contact: '9876543210',
        salary: 30000,
        departmentId: 1,
      };

      const created = {
        ...dto,
        department: { id: dto.departmentId },
      };

      mockEmployeeRepo.create.mockReturnValue(created);
      mockEmployeeRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockEmployeeRepo.create).toHaveBeenCalledWith({
        ...dto,
        department: { id: 1 },
      });
      expect(mockEmployeeRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return paginated employees', async () => {
      const employees = [{ id: 1 }];
      mockEmployeeRepo.findAndCount.mockResolvedValue([employees, 1]);

      const result = await service.findAll(1, 10);

      expect(mockEmployeeRepo.findAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        data: employees,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      const employee = { id: 1, name: 'John' };

      mockEmployeeRepo.findOne.mockResolvedValue(employee);

      const result = await service.findOne(1);

      expect(result).toEqual(employee);
      expect(mockEmployeeRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { department: true },
      });
    });

    it('should throw if employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update employee successfully', async () => {
      const dto = { name: 'Updated' };
      const existing = { id: 1, ...dto };

      mockEmployeeRepo.preload.mockResolvedValue(existing);
      mockEmployeeRepo.save.mockResolvedValue(existing);

      const result = await service.update(1, dto);

      expect(mockEmployeeRepo.preload).toHaveBeenCalledWith({
        id: 1,
        ...dto,
      });
      expect(mockEmployeeRepo.save).toHaveBeenCalledWith(existing);
      expect(result).toEqual({ message: 'update successfully' });
    });

    it('should throw error if employee not found', async () => {
      mockEmployeeRepo.preload.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete employee', async () => {
      const existing = { id: 1 };

      mockEmployeeRepo.findOne.mockResolvedValue(existing);
      mockEmployeeRepo.softDelete.mockResolvedValue(true);

      const result = await service.remove(1);

      expect(mockEmployeeRepo.softDelete).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('should throw error if employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });
});
