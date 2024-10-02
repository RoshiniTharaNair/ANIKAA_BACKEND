import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CustomerService } from "@medusajs/medusa";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Get phone number from query and trim spaces
  let phoneNo = (req.query.phoneNo as string).trim();

  // Add '+' statically in front of the phone number if it doesn't already have it
  if (!phoneNo.startsWith('+')) {
    phoneNo = `+${phoneNo}`;
  }

  console.log("phoneNo with + added: ", phoneNo);

  try {
    // Retrieve customer by phone number
    const customer = await customerService.retrieveByPhone(phoneNo);
    console.log("customer: ", customer);

    res.status(200).json({
      customer,
    });
  } catch (error) {
    // Handle error if phone number is not found
    console.error("Error retrieving customer:", error);
    res.status(200).json({ message: "Customer not found" });
  }
}
