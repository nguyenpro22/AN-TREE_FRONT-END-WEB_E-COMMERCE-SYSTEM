"use client";

import React from "react";
import "react-quill/dist/quill.snow.css";
import { useGetProductByIdQuery } from "@/services/apis";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/Dashboard/ProductDetail";
import { IProductDetail } from "@/types";
import ProductForm from "@/components/Dashboard/ProductDetail/AddUpdate";

export default function Component() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isLoading } = useGetProductByIdQuery(productId);
  if (productId == "new") {
    return <ProductForm />;
  }
  if (product) {
    return <ProductDetails product={product?.value as IProductDetail} />;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>Product not found</div>;
}
