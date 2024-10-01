import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function ProductDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-3/4 mb-2" />
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-gray-300" />
          ))}
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-20 w-full my-4" />
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" className="px-3 py-1" disabled>
            -
          </Button>
          <Skeleton className="w-12 h-8" />
          <Button variant="ghost" className="px-3 py-1" disabled>
            +
          </Button>
        </div>
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}
