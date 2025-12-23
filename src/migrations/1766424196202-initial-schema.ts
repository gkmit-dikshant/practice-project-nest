import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
} from 'typeorm';

export class InitialSchema1766424196202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'departments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            default: null,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
            length: '254',
          },
          {
            name: 'contact',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'department_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'salary',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            default: null,
          },
        ],
      }),
    );

    await queryRunner.createCheckConstraint(
      'employees',
      new TableCheck({
        name: 'EMPLOYEE_SALARY_CHECK',
        columnNames: ['salary'],
        expression: 'salary >= 0',
      }),
    );

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['department_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'departments',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('departments');
    await queryRunner.dropTable('employees');
  }
}
