import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockEmployeesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: jest.Mocked<EmployeesService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('shoude create an employee and send response', async () => {
      // input dto what controller expects
      const createEmployeeDto = {
        name: 'test',
        email: 'test@email.com',
        contact: '9870641215',
        salary: 150000,
        departmentId: 1,
      };
      // what service shoulb return
      const createdEmployee = {
        id: 1,
        name: 'test',
        email: 'test@email.com',
        contact: '9870641215',
        salary: 150000,
        department: { id: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // mock service
      service.create.mockResolvedValue(createdEmployee as any);

      // call controller
      const result = await controller.create(createEmployeeDto);

      //assertion
      expect(service.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(result).toEqual(createdEmployee);
    });
  });

  describe('findAll', () => {
    it('should return list of employee', async () => {
      const page = '1',
        limit = '10';

      const data = [
        {
          id: 1,
          name: 'test',
          email: 'test@email.com',
          contact: '9870641215',
          salary: 150000,
          department: { id: 1 },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      service.findAll.mockResolvedValue(data as any);
      const result = await controller.findAll({ page, limit });
      expect(service.findAll).toHaveBeenCalledWith(+page, +limit);
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    const id = '1';
    it('should return employee', async () => {
      const data = {
        id: 14,
        name: 'test',
        email: 'test@email.com',
        contact: '9876641215',
        salary: 150000,
        department: {
          id: 1,
          name: 'test_dept',
          createdAt: '2025-12-13T12:47:33.273Z',
          updatedAt: '2025-12-13T12:47:33.273Z',
          deletedAt: null,
        },
        createdAt: '2025-12-13T18:38:43.741Z',
        updatedAt: '2025-12-13T18:38:43.741Z',
        deletedAt: null,
      };

      service.findOne.mockResolvedValue(data as any);
      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(+id);
      expect(result).toEqual(data);
    });

    it('should throw http execption', async () => {
      service.findOne.mockRejectedValue(
        new HttpException(
          `Employee with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );

      await expect(controller.findOne(id)).rejects.toThrow(HttpException);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });
  describe('update', () => {
    const id = '1';
    it('should return success message', async () => {
      const dto = {
        name: 'test',
      };
      service.update.mockResolvedValue({ message: 'updated successfully' });
      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(+id, dto);
      expect(result).toEqual({ message: 'updated successfully' });
    });
  });
  describe('delete', () => {
    const id = '1';

    it('should return nothing', async () => {
      service.remove.mockResolvedValue(null);

      await expect(controller.remove(id)).resolves.toEqual(null);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
