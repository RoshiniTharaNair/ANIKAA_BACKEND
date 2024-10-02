import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { UserService } from "@medusajs/medusa";
import Medusa from "@medusajs/medusa-js";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env file
dotenv.config();

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const userService = req.scope.resolve<UserService>("userService");

  const userId = req.query.userId as string;

  const user = await userService.retrieve(userId);
  console.log("user ", user);
  res.status(200).json({
    user,
  });
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const userService = req.scope.resolve<UserService>("userService");

    // Initialize the Medusa client with the base URL from the environment variables
    const medusa = new Medusa({ baseUrl: process.env.MEDUSA_BACKEND_URL, maxRetries: 3 });

    // Create an admin session using email and password from environment variables
    const sessionResponse = await medusa.admin.auth.createSession({
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });

    // Extract the user from the session response
    const user = sessionResponse.user;

    console.log("user.id ", user.id);

    // Check if the user's api_token is null
    if (!user.api_token) {
      // Generate a random APITOKEN
      const APITOKEN = `APITOKEN${crypto.randomBytes(16).toString('hex')}`;

      // Update the user's api_token with the generated APITOKEN
      const userUpdate = await userService.update(user.id, {
        api_token: APITOKEN,
      });

      console.log("userUpdate ", userUpdate);
    } else {
      console.log("User already has an API token: ", user.api_token);
    }

    // Return the user information as part of the response
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.sendStatus(500); // Internal Server Error
  }
}
