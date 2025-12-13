import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
}
