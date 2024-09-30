import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <ul className="mb-8 space-y-2">
      {[...Array(5)].map((_, index) => (
        <li
          key={index}
          className="cursor-pointer py-2 px-4 rounded-lg transition duration-300"
        >
          <Skeleton className="h-6 w-full" />
        </li>
      ))}
    </ul>
  );
}
