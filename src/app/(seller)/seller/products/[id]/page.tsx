"use client";

import React, { useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { useGetProductByIdQuery } from "@/services/apis";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { IProductDetail } from "@/types";

const ProductDetails = dynamic(
  () => import("@/components/Dashboard/ProductDetail"),
  { loading: () => <p>Loading...</p>, ssr: false }
);
const ProductForm = dynamic(
  () => import("@/components/Dashboard/ProductDetail/AddUpdate"),
  { loading: () => <p>Loading...</p>, ssr: false }
);

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { data: product, isLoading } = useGetProductByIdQuery(productId, {
    skip: productId === "new",
  });

  const content = useMemo(() => {
    if (productId === "new") {
      return <ProductForm onClick={() => router.back()} />;
    }

    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (product) {
      return <ProductDetails product={product?.value as IProductDetail} />;
    }

    return <div>Product not found</div>;
  }, [productId, isLoading, product, router]);

  return <div>{content}</div>;
}

const LoadingSkeleton = () => (
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
