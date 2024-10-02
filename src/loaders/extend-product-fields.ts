// Define an asynchronous default function for extending the functionality of the Medusa framework
export default async function () {
    // Dynamically import the 'products/index' module from the Medusa package
    const imports = (await import(
      "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any;  // The import is typed as 'any' to accommodate dynamic nature
  
    // Extend the allowedStoreProductsFields array with additional custom fields
    // This array defines which fields are permissible for exposure in the store front
    imports.allowedStoreProductsFields = [
      ...imports.allowedStoreProductsFields, // Spread to include existing allowed fields
      "avg_price", // Add 'buy_get_number' to the list of allowed fields
      "avg_delivery_time",   // Add 'buy_get_offer' to the list of allowed fields
      "order_frequency"
    ];
  
    // Extend the defaultStoreProductsFields array with additional custom fields
    // This array defines the default set of fields that are sent to the store front
    imports.defaultStoreProductsFields = [
      ...imports.defaultStoreProductsFields, // Spread to include existing default fields
      "avg_price", // Add 'buy_get_number' to the list of allowed fields
      "avg_delivery_time",   // Add 'buy_get_offer' to the list of allowed fields
      "order_frequency"
    ];
  }
  