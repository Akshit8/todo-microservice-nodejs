import { MigrationInterface, QueryRunner } from "typeorm";

export class todoComplete1642322192531 implements MigrationInterface {
  name = "todoComplete1642322192531";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" ADD "completed" boolean NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "completed"`);
  }
}
