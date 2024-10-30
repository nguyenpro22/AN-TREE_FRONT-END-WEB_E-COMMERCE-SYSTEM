"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProductsQuery } from "@/services/apis/ProductAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  StarIcon,
  PlusIcon,
  RefreshCcwIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProduct } from "@/types/ProductType";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { sellerRoutes } from "@/constants/route.constant";

export default function ProductsPage() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const pageSize = 5;
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const {
    data: productsData,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useGetProductsQuery({
    pageIndex: currentPage,
    pageSize: pageSize,
    sortColumn: sortColumn || undefined,
    vendorName: vendor?.name || "  ",
    sortOrder: sortDirection,
    serchTerm: searchTerm,
    isSale: filterDiscount === "discount" ? true : undefined,
  });

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      refetch().then(() => setIsFiltering(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [
    currentPage,
    sortColumn,
    sortDirection,
    searchTerm,
    filterDiscount,
    refetch,
  ]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const products = productsData?.value?.items || [];
  const totalProducts = productsData?.value?.totalCount || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const SortIcon = ({ column }: { column: keyof IProduct }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <SortAscIcon className="ml-2 h-4 w-4" />
    ) : (
      <SortDescIcon className="ml-2 h-4 w-4" />
    );
  };

  const getDiscountColor = (discountPercent: number) => {
    if (discountPercent >= 20) return "bg-red-500 text-white";
    if (discountPercent >= 10) return "bg-orange-500 text-white";
    if (discountPercent > 0) return "bg-yellow-500 text-black";
    return "bg-gray-200 text-gray-700";
  };

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-12 w-12 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[60px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[60px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-[100px]" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4 p-6">
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                <RefreshCcwIcon className="mr-2 h-4 w-4" />
                Làm mới
              </Button>
              <Link href="/seller/products/new">
                <Button variant="secondary" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Thêm sản phẩm mới
                </Button>
              </Link>
              <Select value={filterDiscount} onValueChange={setFilterDiscount}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo khuyến mãi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  <SelectItem value="discount">Có khuyến mãi</SelectItem>
                  <SelectItem value="no-discount">Không khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name <SortIcon column="name" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Price <SortIcon column="price" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("sku")}
                  >
                    SKU <SortIcon column="sku" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("sold")}
                  >
                    Sold <SortIcon column="sold" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("discountPercent")}
                  >
                    Discount <SortIcon column="discountPercent" />
                  </TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFiltering || isFetching ? (
                  Array(pageSize)
                    .fill(0)
                    .map((_, index) => <TableRowSkeleton key={index} />)
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">
                      Error loading products
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-gray-500"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product?.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Image
                          src={product?.coverImage}
                          alt={product?.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product?.name}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {product?.price.toLocaleString()} VND
                        </span>
                        {product?.discountPercent > 0 && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {(
                              product?.price /
                              (1 - product?.discountPercent / 100)
                            ).toFixed(0)}{" "}
                            VND
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{product?.sku}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {product?.sold}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getDiscountColor(
                            product?.discountPercent
                          )} px-2 py-1`}
                        >
                          {product?.discountPercent}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <StarIcon className="mr-1 h-4 w-4 text-yellow-400" />
                          <span className="font-medium">
                            {product?.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link
                            href={`${sellerRoutes.PRODUCT_DETAIL}/${product?.id}`}
                          >
                            <Button variant="secondary" size="sm">
                              Chi Tiết
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalProducts)} of{" "}
              {totalProducts} products
            </p>
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="[&_.ant-pagination-item-active]:bg-purple-500 [&_.ant-pagination-item-active]:text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
