import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(10, 10)
  contact: string;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  salary: number;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  departmentId: number;
}
