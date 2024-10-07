"use client";

import React from "react";
import "react-quill/dist/quill.snow.css";
import { useGetProductByIdQuery } from "@/services/apis";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/Dashboard/ProductDetail";
import { IProductDetail } from "@/types";
import ProductForm from "@/components/Dashboard/ProductDetail/AddUpdate";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { data: product, isLoading } = useGetProductByIdQuery(productId);

  if (productId === "new") {
    return (
      <div>
        <ProductForm onClick={() => router.back()} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (product) {
    return (
      <div>
        <ProductDetails product={product?.value as IProductDetail} />
      </div>
    );
  }

  return (
    <div>
      <div>Product not found</div>
    </div>
  );
}
