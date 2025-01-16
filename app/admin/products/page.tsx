"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/app/components/Notification"; // Adjust the import path

const AdminProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { showNotification } = useNotification(); // Using the useNotification hook

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await apiClient.getProducts();
        setProducts(products);
      } catch (error) {
        showNotification("Failed to fetch products", "error");
      }
    };

    fetchProducts();
  }, [showNotification]);

  // Handle product deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await apiClient.deleteProduct(id);

      if (response.message === "Product deleted successfully") {
        setProducts(products.filter((product) => String(product._id) !== id)); // Update state
        showNotification("Product deleted successfully!", "success");
      } else {
        showNotification("Failed to delete product", "error");
      }
    } catch (error) {
      showNotification("Failed to delete product", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Admin - Manage Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={String(product._id)}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
          >
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{product.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                color="red"
                className="w-full sm:w-auto"
                onClick={() => product._id && handleDelete(product._id.toString())}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
