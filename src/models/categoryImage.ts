import { BeforeInsert, Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
@Unique(["category_id"]) // This will enforce uniqueness on the 'category_id' column
export class CategoryImage extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: "varchar" })
  category_id: string;

  @Column({ type: "varchar" })
  categorythumbnail: string;

  @Column({ type: "varchar" })
  navimage: string;

  @Column({ type: "float", nullable: true })
  avg_price: number; // Stores the average price

  @Column({ type: "int", nullable: true })
  avg_delivery_time: number; // Stores the average delivery time in days

  @Column({ type: "int", nullable: true })
  order_frequency: number; // Stores the order frequency

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "category_image");
  }
}
