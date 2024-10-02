import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryAdditional1727369746401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category_additional" (
                "id" varchar NOT NULL,
                "category_id" varchar NOT NULL UNIQUE,
                "measurements" jsonb NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "category_additional";
        `);
    }
}
