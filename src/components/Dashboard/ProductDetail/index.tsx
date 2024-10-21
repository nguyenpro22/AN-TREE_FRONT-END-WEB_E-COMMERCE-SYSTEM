"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";
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
  ChevronLeft,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProductDetail } from "@/types";
import ProductForm from "./AddUpdate";
import { ImageSliderSkeleton } from "@/components/Skeleton";
import ProductImageSlider from "./ImageSlider";
import { useRouter } from "next/navigation";
import ProductDiscountManagement from "./DiscountInit";

interface ProductDetailsProps {
  product: IProductDetail;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

interface SpecItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  const { averageRating, totalReviews } = useMemo(() => {
    const total = product.productFeedbackList.reduce(
      (acc, feedback) => acc + feedback.rate,
      0
    );
    return {
      averageRating: total / product.productFeedbackList.length || 0,
      totalReviews: product.productFeedbackList.length,
    };
  }, [product.productFeedbackList]);

  if (isEditing) {
    return (
      <ProductForm product={product} onClick={() => setIsEditing(false)} />
    );
  }

  const renderProductDetails = () => (
    <div className="space-y-6 overflow-y-auto custom-scrollbar">
      <>
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

        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-blue-600" />
          <span className="text-4xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-lg text-gray-500 line-through">
                $
                {(product.price / (1 - product.discountPercent / 100)).toFixed(
                  2
                )}
              </span>
              <span className="text-lg font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-md">
                Tiết kiệm {product.discountPercent}%
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Truck className="w-8 h-8 text-blue-500" />}
            title="Giao hàng miễn phí"
            description="Cho đơn hàng trên $50"
            bgColor="bg-blue-50"
          />
          <FeatureCard
            icon={<RotateCcw className="w-8 h-8 text-green-500" />}
            title="Đổi trả dễ dàng"
            description="Trong vòng 30 ngày"
            bgColor="bg-green-50"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-purple-500" />}
            title="Bảo hành 12 tháng"
            description="Chính hãng"
            bgColor="bg-purple-50"
          />
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="vendor">Nhà cung cấp</TabsTrigger>
            <TabsTrigger value="discounts">Giảm giá</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            <div className="prose max-w-none">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Mô tả sản phẩm</h3>
              </div>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <ul className="space-y-2">
              <SpecItem
                icon={<Package className="w-6 h-6 text-gray-500" />}
                label="SKU"
                value={product.sku}
              />
              <SpecItem
                icon={<Tag className="w-6 h-6 text-gray-500" />}
                label="Danh mục"
                value={product.productCategory.name}
              />
              <SpecItem
                icon={<ShoppingCart className="w-6 h-6 text-gray-500" />}
                label="Đã bán"
                value={product.sold.toString()}
              />
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
                  <User className="w-6 h-6 text-gray-500" />
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
          <TabsContent value="discounts" className="mt-4">
            <ProductDiscountManagement productId={product.id} />
          </TabsContent>
        </Tabs>
      </>
    </div>
  );

  const renderProductImages = () => (
    <div className="space-y-4 relative h-fit">
      <ProductImageSlider
        images={product.productImageList.map((img) => ({
          imageUrl: img.imageUrl,
        }))}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </Button>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Product</span>
        </Button>
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
        {product.name}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {renderProductDetails()}
        {renderProductImages()}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, bgColor }: FeatureCardProps) {
  return (
    <div
      className={`flex items-center space-x-3 ${bgColor} p-4 rounded-lg shadow-sm`}
    >
      {icon}
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <li className="flex items-center space-x-2">
      {icon}
      <span className="font-semibold text-gray-700">
        {label}: {value}
      </span>
    </li>
  );
}
