import config from "@/config";
import { TAllProducts } from "@/interface/product";

export async function getAllProducts(): Promise<TAllProducts> {
  try {
    const response = await fetch(`${config.dbUrl}/products`);
    console.log(response);
    if (!response.ok) {
      let errorMessage = `Error fetching product: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = `Error fetching product: ${errorData.message}`;
        }
      } catch (jsonError) {
        console.warn("Could not parse error response as JSON", jsonError);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
}

export async function getProductByID(id:string) {
  const res = fetch(`${config.dbUrl}/products/${id}`)
  
}
