import { Employee } from '../../employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50 })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department, {
    cascade: ['soft-remove'],
    onDelete: 'RESTRICT',
  })
  employees: Employee[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date | null;
}
