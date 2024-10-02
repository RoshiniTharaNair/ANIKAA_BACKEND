import { MigrationInterface, QueryRunner } from "typeorm"

export class AddLineItem1727519612218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            ADD COLUMN "design_preference" text,
            ADD COLUMN "design_images" text[],
            ADD COLUMN "measurement_values" jsonb;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            DROP COLUMN "design_preference", 
            DROP COLUMN "design_images", 
            DROP COLUMN "measurement_values";
        `);
    }

}
