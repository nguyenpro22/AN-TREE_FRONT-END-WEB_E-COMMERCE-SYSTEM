import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageSliderSkeleton() {
  return (
    <div className="relative overflow-hidden w-full h-[400px]">
      <Skeleton className="w-full h-full rounded-lg" />
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
        disabled
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous image</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
        disabled
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next image</span>
      </Button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto pb-2 max-w-full">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="w-[50px] h-[50px] rounded" />
        ))}
      </div>
    </div>
  );
}
