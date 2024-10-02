import { BeforeInsert, Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
@Unique(["category_id"]) // This will enforce uniqueness on the 'category_id' column
export class CategoryAdditional extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: "varchar" })
  category_id: string;

  @Column({ type: "jsonb", nullable: false })
  measurements: Record<string, { value: string; imageUrl?: string }>; // Modified structure for measurements

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "category_additional");
  }
}
