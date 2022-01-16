import { MigrationInterface, QueryRunner } from "typeorm";

export class todoCompleteDefaultValue1642322792905 implements MigrationInterface {
  name = "todoCompleteDefaultValue1642322792905";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo" ALTER COLUMN "completed" SET DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" ALTER COLUMN "completed" DROP DEFAULT`);
  }
}
