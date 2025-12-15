import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  PickType(CreateEmployeeDto, ['name', 'salary', 'departmentId']),
) {}
