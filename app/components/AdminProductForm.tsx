"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useNotification } from "./Notification";
import { IMAGE_VARIANTS, ImageVariantType } from "@/models/Product";
import { apiClient, ProductFormData } from "@/lib/api-client";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath);
    showNotification("Image uploaded successfully!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", "");
      setValue("variants", [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Product Details</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter product name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter product description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label>Product Image</Label>
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Image Variants</h2>

        {fields.map((field, index) => (
          <Card key={field.id} className="p-4 shadow-md space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor={`variants.${index}.type`}>Size & Aspect Ratio</Label>
                <div className="w-full max-w-md truncate">
                  <Select
                    {...register(`variants.${index}.type`)}
                  >
                  {Object.entries(IMAGE_VARIANTS).map(([key, value]) => (
                    <option
                      key={key}
                      value={value.type}
                      title={`${value.label} (${value.dimensions.width}x${value.dimensions.height})`}
                    >
                      {value.label} ({value.dimensions.width}x{value.dimensions.height})
                    </option>
                  ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor={`variants.${index}.license`}>License</Label>
                <Select {...register(`variants.${index}.license`)}>
                  <option value="personal">Personal Use</option>
                  <option value="commercial">Commercial Use</option>
                </Select>
              </div>

              <div>
                <Label htmlFor={`variants.${index}.price`}>Price ($)</Label>
                <Input
                  id={`variants.${index}.price`}
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" },
                  })}
                  placeholder="Enter price"
                />
                {errors.variants?.[index]?.price && (
                  <p className="text-sm text-red-500">
                    {errors.variants[index]?.price?.message}
                  </p>
                )}
              </div>

              <div className="flex items-end justify-end">
                <Button
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={() =>
            append({
              type: "SQUARE" as ImageVariantType,
              price: 9.99,
              license: "personal",
            })
          }
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Variant
        </Button>
      </Card>

      <Button
        type="submit"
        variant="default"
        disabled={loading}
        className="w-full flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  );
}
