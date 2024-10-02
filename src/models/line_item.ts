import { Column, Entity } from "typeorm";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";

@Entity()
export class LineItem extends MedusaLineItem {
    // New column to store design preference description
    @Column({ type: "text", nullable: true })
    design_preference: string;

    // New column to store an array of image URLs for design images
    @Column({ type: "varchar" })
    design_images: string[];

    // New column to store attribute names along with their corresponding values
    @Column("jsonb", { nullable: true })
    measurement_values: Record<string, number>;
}
