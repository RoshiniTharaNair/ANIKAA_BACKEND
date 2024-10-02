// Import necessary types and services
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CategoryAdditionalRepository } from "../../../repositories/categoryAdditional";
import { EntityManager } from "typeorm";
import CategoryAdditionalService from "src/services/categoryAdditional";
import axios from "axios";

// Define the structure of the request body
interface CategoryAdditionalRequestBody {
  category_id: string;
  measurements: string;
}

// Helper function to fetch child category IDs
const fetchChildCategoryIds = async (category_id: string): Promise<string[]> => {
  try {
    const response = await axios.get(`http://localhost:9000/store/childrenCategories?category_id=${category_id}`);
    return response.data.child_category_ids || [];
  } catch (error) {
    console.error("Error fetching child category IDs:", error);
    return [];
  }
};

// Define the GET request handler
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const categoryAdditionalRepository = req.scope.resolve<typeof CategoryAdditionalRepository>("categoryAdditionalRepository");
    const manager = req.scope.resolve<EntityManager>("manager");
    const categoryAdditionalRepo = manager.withRepository(categoryAdditionalRepository);

    const category_id = req.query.category_id as string;

    console.log("Received category_id:", category_id);

    if (category_id) {
      const existingCategoryAdditional = await categoryAdditionalRepo.find({
        where: { category_id: String(category_id) },
      });

      if (existingCategoryAdditional.length > 0) {
        console.log("Found category image:", existingCategoryAdditional);
        return res.status(200).json({ data: existingCategoryAdditional });
      } else {
        console.log("No category image found for category_id:", category_id);
        return res.status(200).json({ message: "Category image not found" });
      }
    } else {
      const categoryAdditionalList = await categoryAdditionalRepo.find();
      return res.status(200).json({ data: categoryAdditionalList });
    }
  } catch (error) {
    console.error("Error fetching category image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Define the POST request handler for creating a new category image entry
export const POST = async (req: MedusaRequest<CategoryAdditionalRequestBody>, res: MedusaResponse) => {
  const categoryAdditionalService: CategoryAdditionalService = req.scope.resolve("categoryAdditionalService");
  const manager = req.scope.resolve<EntityManager>("manager");
  const categoryAdditionalRepo = manager.withRepository(CategoryAdditionalRepository);

  console.log("req body POST", req.body);

  const { category_id, measurements } = req.body;

  if (!category_id || category_id === "") {
    return res.status(400).json({ error: "`category_id` and `measurements` are required." });
  }

  let parsedMeasurements: Record<string, { value: string; imageUrl?: string }>;
  try {
    parsedMeasurements = typeof measurements === "string" ? JSON.parse(measurements) : measurements;
  } catch (error) {
    return res.status(400).json({ error: "Invalid JSON format for measurements." });
  }

  // Fetch child category IDs
  const childCategoryIds = await fetchChildCategoryIds(category_id);
  const allCategoryIds = [category_id, ...childCategoryIds];

  try {
    for (const id of allCategoryIds) {
      const existingCategoryAdditional = await categoryAdditionalRepo.findOne({ where: { category_id: id } });

      if (existingCategoryAdditional) {
        existingCategoryAdditional.measurements = parsedMeasurements;
        await categoryAdditionalRepo.save(existingCategoryAdditional);
      } else {
        await categoryAdditionalService.create({
          category_id: id,
          measurements: parsedMeasurements,
        });
      }
    }

    return res.json({ message: "CategoryAdditional updated/created successfully for all categories." });
  } catch (error) {
    console.error("Error in POST operation:", error);
    return res.status(500).json({ message: "Internal server error while updating/creating measurements." });
  }
};

// Define the DELETE request handler for removing a category image entry
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryAdditionalService: CategoryAdditionalService = req.scope.resolve("categoryAdditionalService");

  const category_id = req.query.category_id as string;

  console.log("Deleting by category_id:", category_id);

  if (!category_id) {
    return res.status(400).json({ error: "`category_id` is required." });
  }

  // Fetch child category IDs
  const childCategoryIds = await fetchChildCategoryIds(category_id);
  const allCategoryIds = [category_id, ...childCategoryIds];

  try {
    for (const id of allCategoryIds) {
      await categoryAdditionalService.delete(id);
    }

    res.status(200).json({ message: "CategoryAdditional deleted successfully for all categories." });
  } catch (error) {
    console.error("Error in DELETE operation:", error);
    res.status(500).json({ message: "Internal server error while deleting measurements." });
  }
};
