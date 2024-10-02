// Import necessary types from Medusa and other utilities for working with the file system and forms.
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import formidable from "formidable"; // For parsing form data, including file uploads.
import path from "path"; // Provides utilities for working with file and directory paths.
import fs from "fs/promises"; // File System module with Promise-based API for working with the file system.
import dotenv from "dotenv";

dotenv.config();

// Function to handle file reading from a request with optional saving to a local directory.
const readFile = (req: MedusaRequest, saveLocally?: boolean): Promise<{fields: formidable.Fields; files: formidable.Files}> => {
    const options: formidable.Options = {}; // Formidable options.

    if (saveLocally) {
        // Set the directory where files should be uploaded.
        options.uploadDir = "C://Users//Roshini//Downloads//fashion-design-backend//uploads";

        // Define how uploaded files are named.
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + path.originalFilename; // Unique filename based on the timestamp.
        };
    }

    // Initialize Formidable with the specified options.
    const form = formidable(options);

    // Parse the incoming form data.
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err); // Reject the promise on error.
            resolve({fields, files}); // Resolve with the parsed fields and files.
        });
    });
};

// Global variable to cache directory contents, demonstrating a basic caching strategy.
let dirsCache = [];

// Helper function to generate file URL
const generateFileUrl = (filePath: string) => {
    return `${process.env.MEDUSA_BACKEND_URL}/uploads/${path.basename(filePath)}`;
}

// Main function for handling the POST request.
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    console.log('POST method at imageUpload');
    // Define the media directory where files will be uploaded.
    const mediaDir = "C://Users//Roshini//Downloads//fashion-design-backend//uploads";
  
    try {
      // Attempt to read the directory, which will throw an error if it doesn't exist.
      await fs.readdir(mediaDir);
    } catch (error) {
      // If the directory doesn't exist, create it including any necessary parent directories.
      await fs.mkdir(mediaDir, { recursive: true });
    }
  
    try {
      // Read and process the uploaded files.
      const { files } = await readFile(req, true);
  
      // Extract category and navigation images from the uploaded files
      const categoryImage = files.categoryimage ? files.categoryimage[0] : null;
      const navImage = files.navimage ? files.navimage[0] : null;

      // Prepare responses for each uploaded image
      const response = {
        done: "ok",
        files: {} as Record<string, any>,
        dirs: dirsCache,
      };

      // Handle category image if uploaded
      if (categoryImage) {
        const categoryImagePath = categoryImage.filepath;
        await fs.stat(categoryImagePath); // Ensure the file exists
        response.files.categoryImage = {
          path: categoryImagePath,
          url: generateFileUrl(categoryImagePath),
          size: categoryImage.size,
          type: categoryImage.mimetype,
        };
      }

      // Handle navigation image if uploaded
      if (navImage) {
        const navImagePath = navImage.filepath;
        await fs.stat(navImagePath); // Ensure the file exists
        response.files.navImage = {
          path: navImagePath,
          url: generateFileUrl(navImagePath),
          size: navImage.size,
          type: navImage.mimetype,
        };
      }

      // Send the response including details about the uploaded files
      res.json(response);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      // Send an error response including details of the failure.
      res.status(500).json({
        error: "File upload failed",
        details: error.message,
        dirs: dirsCache // Include cached directory information even in error responses.
      });
    }
};
