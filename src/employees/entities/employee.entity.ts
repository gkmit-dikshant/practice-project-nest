import { Department } from 'src/departments/entities/department.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
@Check('"salary" > 0')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ unique: true, nullable: false, length: 254 })
  email: string;

  @Column({ unique: true, nullable: false, length: 10 })
  contact: string;

  @Column({ nullable: false })
  salary: number;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: false,
  })
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department: Department;

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
