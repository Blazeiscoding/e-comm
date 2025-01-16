import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useNotification } from "./Notification";
import {  ImageVariantType } from "@/models/Product";
import { apiClient, ProductFormData } from "@/lib/api-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const variantOptions = [
  { label: "Square", value: "SQUARE", dimensions: "1000x1000px" },
  { label: "Wide", value: "WIDE", dimensions: "1080x1920px" },
  { label: "Portrait", value: "PORTRAIT", dimensions: "1080x1440px" },
];

const licenseOptions = [
  { label: "Personal", value: "personal" },
  { label: "Commercial", value: "commercial" },
];

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
      {/* Product Details */}
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

      {/* Image Variants */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Image Variants</h2>

        {/* Dynamic Variants Section */}
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4 shadow-md space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Variant Type */}
              <div>
                <Label htmlFor={`variants.${index}.type`}>Variant Type</Label>
                <Select
                  defaultValue={field.type}
                  {...register(`variants.${index}.type`)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant type" />
                  </SelectTrigger>
                  <SelectContent>
                    {variantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
              </div>

              {/* License Selection */}
              <div>
                <Label htmlFor={`variants.${index}.license`}>License</Label>
                <Select
                  defaultValue={field.license}
                  {...register(`variants.${index}.license`)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
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
