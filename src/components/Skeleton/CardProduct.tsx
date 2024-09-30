import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      {/* Discount Label Skeleton */}
      <Skeleton className="absolute top-2 right-2 h-6 w-12 rounded" />

      {/* Product Image Skeleton */}
      <Skeleton className="rounded-lg w-[200px] h-[200px] mb-4" />

      {/* Product Name Skeleton */}
      <Skeleton className="h-6 w-3/4 mb-2" />

      {/* Rating Skeleton */}
      <div className="flex items-center mb-2 w-full justify-center">
        <Skeleton className="h-4 w-24 mr-2" />
        <Skeleton className="h-4 w-8" />
      </div>

      {/* Price Skeleton */}
      <div className="flex justify-between items-center space-x-2 w-full">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Number of Products Sold Skeleton */}
      <Skeleton className="h-4 w-24 mt-2" />
    </div>
  );
}
