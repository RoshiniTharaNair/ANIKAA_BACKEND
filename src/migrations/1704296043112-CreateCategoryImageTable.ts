import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryImageTable1704296043112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category_image" (
                "id" varchar NOT NULL,
                "category_id" varchar NOT NULL UNIQUE,
                "categorythumbnail" varchar NOT NULL,
                "navimage" varchar NOT NULL,
                "avg_price" float,
                "avg_delivery_time" int,
                "order_frequency" int,
                "created_at" timestamp NOT NULL DEFAULT NOW(),
                "updated_at" timestamp NOT NULL DEFAULT NOW(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "category_image";
        `);
    }
}
