import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductColumns1726558947106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "product" 
            ADD COLUMN "avg_price" float, 
            ADD COLUMN "avg_delivery_time" float,
            ADD COLUMN "order_frequency" int;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "product" 
            DROP COLUMN "avg_price", 
            DROP COLUMN "avg_delivery_time"
        `);
    }
}
