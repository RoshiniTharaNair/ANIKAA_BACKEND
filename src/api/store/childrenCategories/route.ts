import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"; // Ensure the base URL is set correctly

// Recursive function to get all child category IDs
async function getAllChildCategoryIds(categoryId: string, apiToken: string): Promise<string[]> {
  try {
    // Make an API request to get the category by ID
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/admin/product-categories/${categoryId}`, {
      headers: {
        "x-medusa-access-token": apiToken, // Pass the token in the header
      },
    });

    const category = response.data.product_category;
    const childCategoryIds: string[] = [];

    // If the category has children, recursively fetch their IDs
    for (const childCategory of category.category_children) {
      childCategoryIds.push(childCategory.id);
      const childIds = await getAllChildCategoryIds(childCategory.id, apiToken);
      childCategoryIds.push(...childIds); // Collect IDs of the children of the current child category
    }

    return childCategoryIds; // Return all child category IDs
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryId}:`, error);
    throw new Error(`Unable to fetch category with ID ${categoryId}`);
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    res.status(500).json({ message: "API token is missing" });
  }

  // Get the category_id from the query parameters
  const categoryId = req.query.category_id as string;

  if (!categoryId) {
    res.status(400).json({ message: "Category ID is missing in the request query." });
  }

  try {
    // Fetch all child category IDs for the given category_id
    const allChildCategoryIds = await getAllChildCategoryIds(categoryId, apiToken);

    // Send the category IDs in the response
    res.status(200).json({
      category_id: categoryId,
      child_category_ids: allChildCategoryIds,
    });
  } catch (error) {
    // Handle error
    console.error("Error fetching category and its children:", error);
    res.status(500).json({ message: "Error retrieving category children", error: error.message });
  }
}
