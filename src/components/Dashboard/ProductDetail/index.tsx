"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Truck,
  RotateCcw,
  Shield,
  Package,
  DollarSign,
  ShoppingCart,
  FileText,
  Tag,
  User,
  MapPin,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProductDetail } from "@/types";
import ProductForm from "./AddUpdate";
import { ImageSliderSkeleton } from "@/components/Skeleton";
import ProductImageSlider from "./ImageSlider";

interface ProductDetailsProps {
  product: IProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const averageRating =
    product.productFeedbackList.reduce(
      (acc, feedback) => acc + feedback.rate,
      0
    ) / product.productFeedbackList.length;
  const totalReviews = product.productFeedbackList.length;

  if (isEditing) {
    return <ProductForm product={product} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {product.name}
        </h1>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Product</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Product Details */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              {/* Product Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-700">
                  {averageRating.toFixed(1)} ({totalReviews} đánh giá)
                </span>
              </div>

              {/* Price and Discount */}
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercent > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      $
                      {(
                        product.price /
                        (1 - product.discountPercent / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="text-lg font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-md">
                      Tiết kiệm {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg shadow-sm">
                  <Truck className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Giao hàng miễn phí
                    </h4>
                    <p className="text-sm text-gray-600">
                      Cho đơn hàng trên $50
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg shadow-sm">
                  <RotateCcw className="w-8 h-8 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Đổi trả dễ dàng
                    </h4>
                    <p className="text-sm text-gray-600">Trong vòng 30 ngày</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-purple-500" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Bảo hành 12 tháng
                    </h4>
                    <p className="text-sm text-gray-600">Chính hãng</p>
                  </div>
                </div>
              </div>

              {/* Product Information Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
                  <TabsTrigger value="vendor">Nhà cung cấp</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="prose max-w-none">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold">Mô tả sản phẩm</h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="specs" className="mt-4">
                  <ul className="space-y-2">
                    <li>
                      <div className="flex items-center space-x-2">
                        <Package className="w-7 h-7 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <Tag className="w-7 h-7 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          Danh mục: {product.productCategory.name}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-7 h-7 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          Đã bán: {product.sold}
                        </span>
                      </div>
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="vendor" className="mt-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={product.vendor.avatarImage}
                      alt={product.vendor.name}
                      width={130}
                      height={130}
                      className="rounded-full object-cover shadow-lg"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <User className="w-7 h-7 text-gray-500" />
                        <h3 className="font-semibold text-lg">
                          {product.vendor.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {product.vendor.city}, {product.vendor.province}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        {/* Right Column - Product Images */}
        <div className="space-y-4 relative">
          {isLoading ? (
            <ImageSliderSkeleton />
          ) : (
            <ProductImageSlider images={product.productImageList} />
          )}
        </div>
      </div>
    </div>
  );
}
