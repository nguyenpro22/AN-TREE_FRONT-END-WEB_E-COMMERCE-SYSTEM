import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageSliderProps {
  images: { imageUrl: string }[];
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const clonedImageList = [...images, images[0]];

  const handlePrevImage = () => {
    if (currentImageIndex === 0) {
      setIsTransitioning(false);
      setCurrentImageIndex(clonedImageList.length - 1);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentImageIndex(images.length - 1);
      }, 0);
    } else {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex === clonedImageList.length - 1) {
      setIsTransitioning(false);
      setCurrentImageIndex(0);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentImageIndex(1);
      }, 0);
    } else {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = isTransitioning
        ? "transform 0.5s ease-in-out"
        : "none";
      sliderRef.current.style.transform = `translateX(-${
        currentImageIndex * (100 / clonedImageList.length)
      }%)`;
    }
  }, [currentImageIndex, isTransitioning, clonedImageList.length]);

  return (
    <div className="relative overflow-hidden w-full h-[400px]">
      {clonedImageList.length > 0 && (
        <div
          ref={sliderRef}
          className="flex h-full"
          style={{ width: `${clonedImageList.length * 100}%` }}
        >
          {clonedImageList.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative"
              style={{ flex: `0 0 ${100 / clonedImageList.length}%` }}
            >
              <Image
                src={img?.imageUrl || ""}
                alt={`Product Image ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
        onClick={handlePrevImage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous image</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
        onClick={handleNextImage}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next image</span>
      </Button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2  pb-2 max-w-full">
        {images.map((img, index) => (
          <button
            key={index}
            className={`flex-shrink-0 border-2 ${
              index === currentImageIndex
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <Image
              src={img?.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={50}
              height={50}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
