// Import necessary types and services
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CategoryImageRepository } from "../../../repositories/categoryImage";
import { EntityManager } from "typeorm";
import CategoryImageService from "src/services/categoryImage";

// Define the structure of the request body
interface CategoryImageRequestBody {
  category_id: string;
  categorythumbnail: string;
  navimage: string;
  avg_price: number; // New field
  avg_delivery_time: number; // New field
  order_frequency: number; // New field
}

// Define the GET request handler
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve the repositories and manager
    const categoryImageRepository = req.scope.resolve<typeof CategoryImageRepository>("categoryImageRepository");
    const manager = req.scope.resolve<EntityManager>("manager");
    const categoryImageRepo = manager.withRepository(categoryImageRepository);

    // Get the category_id from the query parameters
    const category_id = req.query.category_id as string;

    console.log("Received category_id:", category_id);

    // If category_id is provided, fetch the specific category image
    if (category_id) {
      const existingCategoryImage = await categoryImageRepo.find({
        where: { category_id: String(category_id) },
      });

      // Check if the category image exists
      if (existingCategoryImage.length > 0) {
        console.log("Found category image:", existingCategoryImage);
        return res.status(200).json({ data: existingCategoryImage });
      } else {
        // If no image is found, return a 404 error
        console.log("No category image found for category_id:", category_id);
        return res.status(200).json({ message: "Category image not found" });
      }
    } else {
      // If no category_id is provided, return all category images
      const categoryImageList = await categoryImageRepo.find();
      return res.status(200).json({ data: categoryImageList });
    }
  } catch (error) {
    // Catch and log any errors that occur during the request
    console.error("Error fetching category image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Define the POST request handler for creating a new category image entry
export const POST = async (req: MedusaRequest<CategoryImageRequestBody>, res: MedusaResponse) => {
  const categoryImageService: CategoryImageService = req.scope.resolve("categoryImageService");
  const manager = req.scope.resolve<EntityManager>("manager");
  const categoryImageRepo = manager.withRepository(CategoryImageRepository);

  console.log("req body POST", req.body);

  // Destructure req.body directly
  const { category_id, categorythumbnail, navimage, avg_price, avg_delivery_time, order_frequency } = req.body;

  // Basic validation of request body
  if (!category_id || category_id === "") {
    return res.status(400).json({ error: "`category_id`, `categorythumbnail`, `navimage`, `avg_price`, `avg_delivery_time`, and `order_frequency` are required." });
  }

  // Check if an entry with the same category_id already exists
  const existingCategoryImage = await categoryImageRepo.findOne({ where: { category_id } });

  if (existingCategoryImage) {
    existingCategoryImage.categorythumbnail = categorythumbnail;
    existingCategoryImage.navimage = navimage;
    existingCategoryImage.avg_price = avg_price;
    existingCategoryImage.avg_delivery_time = avg_delivery_time;
    existingCategoryImage.order_frequency = order_frequency;
    await categoryImageRepo.save(existingCategoryImage);
    return res.json({ message: "CategoryImage updated successfully", categoryImage: existingCategoryImage });
  } else {
    // Ensure req.body is typed correctly and spreadable
    const newCategoryImage = await categoryImageService.create({
      category_id,
      categorythumbnail: categorythumbnail || "", // Fill with empty string if null
      navimage: navimage || "", // Fill with empty string if null
      avg_price: avg_price || 0, // Default to 0 if not provided
      avg_delivery_time: avg_delivery_time || 0, // Default to 0 if not provided
      order_frequency: order_frequency || 0, // Default to 0 if not provided
    });
    return res.json({ message: "CategoryImage created successfully", categoryImage: newCategoryImage });
  }
}

// Define the DELETE request handler for removing a category image entry
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryImageService: CategoryImageService = req.scope.resolve("categoryImageService");
  
  const id = req.query.id as string;

  console.log("deleted by id ", id);

  await categoryImageService.delete(id);

  res.status(200).end();
}
