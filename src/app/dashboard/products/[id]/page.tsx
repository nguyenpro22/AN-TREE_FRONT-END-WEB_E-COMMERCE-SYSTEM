"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProductForm() {
  const { id } = useParams();
  const isNewProduct = id === "new";

  // TODO: Implement form logic, image upload, and rich text editor

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        {isNewProduct ? "Add New Product" : "Edit Product"}
      </h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name">Product Name</label>
          <Input id="name" placeholder="Enter product name" />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <Input id="price" type="number" placeholder="Enter price" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Textarea id="description" placeholder="Enter product description" />
        </div>
        {/* TODO: Add image upload component */}
        {/* TODO: Add rich text editor component */}
        <div>
          <label htmlFor="discount">Discount</label>
          <Input
            id="discount"
            type="number"
            placeholder="Enter discount percentage"
          />
        </div>
        <Button type="submit">Save Product</Button>
      </form>
    </div>
  );
}
