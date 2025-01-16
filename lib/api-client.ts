import { IOrder } from "@/models/Order";
import { IProduct, ImageVariant, ImageVariantType } from "@/models/Product";
import { Types } from "mongoose";

export interface ProductFormData {

  name: string;

  description: string;

  imageUrl: string;

  variants: {

    type?: ImageVariantType;

    price?: number;

    license?: string;

    dimensions?: { width: number; height: number };

  }[];

}
export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }
}

export const apiClient = new ApiClient();
