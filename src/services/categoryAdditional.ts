// Import necessary libraries and models
import { Lifetime } from "awilix";
import { CategoryAdditionalRepository } from "../repositories/categoryAdditional";
import { CategoryAdditional } from "../models/categoryAdditional";
import { FindConfig, Selector, TransactionBaseService, buildQuery } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"

// Define the CategoryAdditionalService class
class CategoryAdditionalService extends TransactionBaseService {
  // Define the lifetime of the service in the dependency injection container
  static LIFE_TIME = Lifetime.SCOPED;

  // CategoryAdditional repository instance
  protected categoryAdditionalRepository_: typeof CategoryAdditionalRepository;

  // Constructor for categoryAdditionalService
  constructor(container) {
    super(container) // Call the constructor of the base class
    this.categoryAdditionalRepository_ = container.categoryAdditionalRepository; // Initialize categoryAdditional repository
  }

  // Method to list and count categoryAdditional items with pagination and filtering
  async listAndCount(
    selector?: Selector<CategoryAdditional>, // Filter criteria
    config: FindConfig<CategoryAdditional> = { // Default pagination and relation configuration
      skip: 0,
      take: 20,
      relations: [],
    }): Promise<[CategoryAdditional[], number]> { // Returns a tuple of CategoryAdditional array and count
    const categoryAdditionalRepo = this.activeManager_.withRepository(this.categoryAdditionalRepository_)
    const query = buildQuery(selector, config) // Build query based on selector and config
    return categoryAdditionalRepo.findAndCount(query) // Return the result of the query
  }

  // Method to list categoryAdditional items
  async list(
    selector?: Selector<CategoryAdditional>, // Filter criteria
    config: FindConfig<CategoryAdditional> = { // Default pagination and relation configuration
      skip: 0,
      take: 20,
      relations: [],
    }): Promise<CategoryAdditional[]> { // Returns an array of CategoryAdditional items
    const [categoryAdditionals] = await this.listAndCount(selector, config) // Reuse listAndCount method
    return categoryAdditionals
  }

  // Method to create a new categoryAdditionals item
  async create(
    data: Pick<CategoryAdditional, "category_id" | "measurements" > // Data for the new CategoryAdditional item
  ): Promise<CategoryAdditional> {
    // Execute in an atomic transaction
    return this.atomicPhase_(async (manager) => {
      const categoryAdditionalRepo = manager.withRepository(this.categoryAdditionalRepository_)
      const categoryAdditional = categoryAdditionalRepo.create() // Create a new categoryAdditional instance
      // Set the data for the new categoryAdditional item
      categoryAdditional.category_id = data.category_id
      categoryAdditional.measurements = data.measurements
      
      const result = await categoryAdditionalRepo.save(categoryAdditional) // Save the new categoryAdditional item
      return result
    })
  }

  // Method to retrieve a specific comments item by ID
  async retrieve(
    id: string, // Comments item ID
    config?: FindConfig<CategoryAdditional> // Additional configuration for the query
  ): Promise<CategoryAdditional> {
    const categoryAdditionalRepo = this.activeManager_.withRepository(this.categoryAdditionalRepository_)
    const query = buildQuery({ id }, config) // Build the query to find the categoryAdditional item
    const categoryAdditional = await categoryAdditionalRepo.findOne(query) // Retrieve the categoryAdditional item
    if (!categoryAdditional) {
      // If the categoryAdditional item is not found, throw an error
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "categoryAdditional was not found"
      )
    }
    return categoryAdditional // Return the found categoryAdditional item
  }

  // Method to update a categoryAdditional item
  async update(
    id: string, // categoryAdditional item ID
    data: Omit<Partial<CategoryAdditional>, "id"> // Data to update the CategoryAdditional item
  ): Promise<CategoryAdditional> {
    // Execute in an atomic transaction
    return await this.atomicPhase_(async (manager) => {
      const categoryAdditionalRepo = manager.withRepository(this.categoryAdditionalRepository_)
      const categoryAdditional = await this.retrieve(id) // Retrieve the existing categoryAdditional item
      Object.assign(categoryAdditional, data) // Update the categoryAdditional item with new data
      return await categoryAdditionalRepo.save(categoryAdditional) // Save the updated categoryAdditional item
    })
  }

  // Method to delete a categoryAdditional item
  async delete(id: string): Promise<void> {
    // Execute in an atomic transaction
    return await this.atomicPhase_(async (manager) => {
      const categoryAdditionalRepo = manager.withRepository(this.categoryAdditionalRepository_)
      const categoryAdditional = await this.retrieve(id) // Retrieve the categoryAdditional item to delete
      await categoryAdditionalRepo.remove([categoryAdditional]) // Remove the categoryAdditional item
    })
  }
}

// Export the categoryAdditionalService class
export default CategoryAdditionalService;
