// Import necessary types for handling Medusa requests and responses.
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
// Import the Medusa client to communicate with the Medusa server.
import Medusa from "@medusajs/medusa-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define an asynchronous GET function for handling incoming requests.
export async function GET(
  req: MedusaRequest, // The incoming request object.
  res: MedusaResponse // The response object to send data back to the client.
): Promise<void> {
  // Initialize a new instance of the Medusa client with the server's base URL and retry configurations.
  const medusa = new Medusa({ baseUrl: process.env.MEDUSA_BACKEND_URL, maxRetries: 3 });

  try {
    // Retrieve the API token from environment variables
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
      // If the API token is missing, respond with an error message
      res.status(500).json({ message: "API token is missing" });
      return; // Stop further execution if the token is missing
    }

    // Reinitialize the Medusa client with the obtained API token for authenticated requests.
    const medusaAccessed = new Medusa({
      baseUrl: process.env.MEDUSA_BACKEND_URL,
      maxRetries: 3,
      apiKey: apiToken,
    });

    // Extract discount and condition IDs from the request query
    let discId = req.query.discount_id; // Extract the discount ID from the request query.
    let conId = req.query.conditionId; // Extract the condition ID from the request query.

    // Asynchronously retrieve the discount condition from the Medusa server, including related products.
    const discountConditionResponse = await medusaAccessed.admin.discounts
      .getCondition(`${discId}`, `${conId}`, {
        expand: "products", // Specify to include related products in the response.
      })
      .then(({ discount_condition }) => {
        // Respond with the related products if they exist; otherwise, indicate no products are associated.
        if (discount_condition.products) {
          res.status(200).json({ products: discount_condition.products });
        } else {
          res.status(200).json({ status: "No products" });
        }
      });

  } catch (error) {
    // Catch and log any errors that occur during the process.
    console.error("Error:", error);
    // Respond with a 500 Internal Server Error status and an error message.
    res.status(500).json({ error: "Internal Server Error" });
  }
}
