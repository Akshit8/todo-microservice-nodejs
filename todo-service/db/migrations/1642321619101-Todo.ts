import { MigrationInterface, QueryRunner } from "typeorm";

export class Todo1642321619101 implements MigrationInterface {
  name = "Todo1642321619101";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo" ("id" SERIAL NOT NULL, "owner" integer NOT NULL, "action_item" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todo"`);
  }
}
