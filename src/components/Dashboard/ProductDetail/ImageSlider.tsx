"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageSliderProps {
  images: { imageUrl: string }[];
}

export default function ProductImageSlider({
  images,
}: ProductImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Main Image */}
      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImageIndex]?.imageUrl || ""}
          alt={`Product Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 ease-in-out transform "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-all duration-300 shadow-md"
        onClick={handlePrevImage}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous image</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-all duration-300 shadow-md"
        onClick={handleNextImage}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next image</span>
      </Button>
      {/* Thumbnail Images */}
      <div className="mt-3 flex justify-center gap-3 overflow-x-auto py-2">
        {images.map((img, index) => (
          <button
            key={index}
            className={cn(
              "flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 p-1", // Add padding here
              index === currentImageIndex
                ? "border-2 border-blue-500 shadow-lg transform scale-110"
                : "border-2 border-transparent opacity-80 hover:opacity-100 hover:border-gray-300 hover:scale-105"
            )}
            onClick={() => setCurrentImageIndex(index)}
          >
            <Image
              src={img?.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={60}
              height={60}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
