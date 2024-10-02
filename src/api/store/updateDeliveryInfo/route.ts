// Import ProductService from MedusaJS for handling product-related operations
import { ProductService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// Define an interface for the expected request body
interface UpdateProductRequestBody {
  id: string;
  avg_price?: number;
  avg_delivery_time?: number;
}

// Extend the default UpdateProductInput type with your custom fields
type UpdateProductInputWithCustomFields = {
  avg_price?: number;
  avg_delivery_time?: number;
};

// Define a POST request handler to update product fields
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Resolve the ProductService from the request's scope for product operations
  const productService = req.scope.resolve<ProductService>("productService");

  // Type-cast the request body to match the expected structure
  const { id, avg_price, avg_delivery_time } = req.body as UpdateProductRequestBody;

  // Log the product ID for debugging
  console.log("id at body ", id);

  // Retrieve the product by ID
  const product = await productService.retrieve(id);

  if (!product) {
    // If the product is not found, return a 404 Not Found response
    return res.status(404).json({ message: "Product not found" });
  }

  // Prepare the fields to update in the product, including custom fields
  const updateData: UpdateProductInputWithCustomFields = {};

  // Update `avg_price` if it is provided
  if (avg_price !== undefined) {
    updateData.avg_price = avg_price;
  }

  // Update `avg_delivery_time` if it is provided
  if (avg_delivery_time !== undefined) {
    updateData.avg_delivery_time = avg_delivery_time;
  }

  // Update the product with the new values
  const productUpdate = await productService.update(id, updateData as any); // Cast to `any` to bypass strict type issues temporarily

  // Send the updated product as a JSON response
  res.json({
    productUpdate,
  });
};
