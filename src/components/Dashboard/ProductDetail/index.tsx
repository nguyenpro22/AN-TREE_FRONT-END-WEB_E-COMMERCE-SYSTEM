"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductImageSlider from "./ImageSlider";
import { IProductDetail } from "@/types";

interface ProductDetailsProps {
  product: IProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const averageRating =
    product.productFeedbackList.reduce(
      (acc, feedback) => acc + feedback.rate,
      0
    ) / product.productFeedbackList.length;
  const totalReviews = product.productFeedbackList.reduce(
    (acc, feedback) => acc + feedback.total,
    0
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Khu vực hiển thị hình ảnh sản phẩm */}
        <div className="lg:sticky lg:top-24 h-fit">
          <ProductImageSlider images={product.productImageList} />
        </div>

        {/* Khu vực chi tiết sản phẩm */}
        <div className="space-y-8">
          {/* Tên sản phẩm và đánh giá */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <h1 className="text-4xl font-bold mb-3 text-gray-900">
                Tên sản Phẩm: {product.name}
              </h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 transition-transform duration-300 ease-in-out ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400 fill-current scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-md text-gray-600">
                  ({totalReviews} đánh giá)
                </span>
              </div>

              {/* Giá sản phẩm và khuyến mãi */}
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-4xl font-bold text-blue-600">
                  Giá: ${product.price.toFixed(2)}
                </span>
                {product.discountPercent > 0 && (
                  <Badge variant="destructive" className="text-lg">
                    {product.discountPercent}% GIẢM
                  </Badge>
                )}
              </div>

              <Separator className="my-4" />

              {/* Mô tả sản phẩm */}
              <div>
                Mô tả sản phẩm:
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Thông tin chi tiết sản phẩm */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-4 text-gray-800">
                Thông tin chi tiết
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <span className="font-medium">Mã SKU:</span> {product.sku}
                </li>
                <li>
                  <span className="font-medium">Danh mục:</span>{" "}
                  {product.productCategory.name}
                </li>
                <li>
                  <span className="font-medium">Số lượng bán:</span>{" "}
                  {product.sold}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Thông tin nhà cung cấp */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-4 text-gray-800">
                Thông tin nhà cung cấp
              </h3>
              <div className="flex items-center space-x-4">
                <Image
                  src={product.vendor.avatarImage}
                  alt={product.vendor.name}
                  width={60}
                  height={60}
                  className="rounded-full border border-gray-200 shadow-sm"
                />
                <div>
                  <p className="font-medium text-lg">{product.vendor.name}</p>
                  <p className="text-md text-gray-600">
                    {product.vendor.city}, {product.vendor.province}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
