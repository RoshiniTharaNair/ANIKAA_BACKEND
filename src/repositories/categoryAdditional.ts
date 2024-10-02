import { CategoryAdditional } from "../models/categoryAdditional"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const CategoryAdditionalRepository = dataSource
  .getRepository(CategoryAdditional)
  .extend({
    customMethod(): void {
      // TODO add custom implementation
      return
    },
  })

export default CategoryAdditionalRepository