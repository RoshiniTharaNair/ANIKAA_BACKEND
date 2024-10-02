import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const apiToken = process.env.API_TOKEN;
  const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

  if (!apiToken) {
    res.status(500).json({ message: "API token is missing" });
  }

  // Get category_id from the query parameters
  const categoryId = req.query.category_id as string;

  if (!categoryId) {
    res.status(400).json({ message: "Category ID is missing in the request query." });
  }

  try {
    // Step 1: Get all child category IDs from the /store/childrenCategories API
    const childCategoriesResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/childrenCategories`, {
      params: { category_id: categoryId },
    });

    const childCategoryIds: string[] = childCategoriesResponse.data.child_category_ids;
    
    console.log("childCategoryIds ",childCategoryIds)

    // Include the main category ID along with all child IDs
    const allCategoryIds = [categoryId, ...childCategoryIds];

    console.log("allCategoryIds ",allCategoryIds)
    // Step 2: Fetch all products from the /admin/products API
    const productResponse = await axios.get(`${MEDUSA_BACKEND_URL}/admin/products`, {
      headers: {
        "x-medusa-access-token": apiToken, // Pass the token in the header
      },
    });

    const allProducts = productResponse.data.products;

    // Step 3: Filter products where the product categories include any of the category IDs (parent or children)
    const filteredProducts = allProducts.filter((product: any) =>
      product.categories.some((category: any) => allCategoryIds.includes(category.id))
    );

    if (filteredProducts.length === 0) {
      res.status(404).json({ message: "No products found for this category and its children." });
    }

    // Step 4: Return the filtered products in the response
    res.status(200).json({ products: filteredProducts });

  } catch (error) {
    // Handle error
    console.error("Error retrieving products or categories:", error);
    res.status(500).json({ message: "Error retrieving products or categories", error: error.message });
  }
}
