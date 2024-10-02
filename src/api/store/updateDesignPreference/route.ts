// Import LineItemService from MedusaJS for handling line item operations
import { LineItemService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// Extend the request body to include new fields for updating line items
interface UpdateLineItemRequestBody {
  id: string;
  design_preference?: string;
  design_images?: string[];
  measurement_values?: Record<string, number>;
}

// Extend the product input type to include custom fields
type UpdateProductInputWithCustomFields = {
  design_preference?: string;
  design_images?: string[];
  measurement_values?: Record<string, number>;
};

// Define a POST request handler to update line items
export const POST = async (req: MedusaRequest<UpdateLineItemRequestBody>, res: MedusaResponse) => {
  // Resolve the LineItemService from the request's scope for line item operations
  const lineItemService = req.scope.resolve<LineItemService>("lineItemService");

  try {
    // Extract data from the request body
    const { id, design_preference, design_images, measurement_values } = req.body;

    console.log("id: ", id);
    console.log("design_preference: ", design_preference);
    console.log("design_images: ", design_images);
    console.log("measurement_values: ", measurement_values);

    // Prepare the update data object
    const updateData: UpdateProductInputWithCustomFields = {};

    if (design_preference !== undefined) {
      updateData.design_preference = design_preference;
    }

    if (design_images !== undefined) {
      updateData.design_images = design_images;
    }

    if (measurement_values !== undefined) {
      updateData.measurement_values = measurement_values;
    }

    let lineitems;

    // If id is provided, retrieve a specific line item and update it
    if (id) {
      try {
        // Retrieve the existing line item by id
        lineitems = await lineItemService.retrieve(id);

        // Update the line item with the provided data
        const lineItemUpdate = await lineItemService.update(id, updateData as any);

        console.log("lineItemUpdate: ", lineItemUpdate);
        lineitems = lineItemUpdate; // Update the response to return the updated line item
      } catch (error) {
        return res.status(404).json({ message: "Line item not found" });
      }
    } else {
      // If no id is provided, retrieve all line items (without updating anything)
      lineitems = await lineItemService.list({});
    }

    // Return the line items in the response
    res.status(200).json({
      lineitems,
    });
  } catch (error) {
    // Handle errors, such as database issues or service retrieval failures
    console.error("Error fetching or updating line items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
