import { Column, Entity } from "typeorm"
import { Product as MedusaProduct } from "@medusajs/medusa"

@Entity()
export class Product extends MedusaProduct {

    @Column({ type: "float", nullable: true })
    avg_price: number;

    @Column({ type: "float", nullable: true })
    avg_delivery_time: number;

    @Column({ type: "int", nullable: true })
    order_frequency: number; // Stores the order frequency
}
