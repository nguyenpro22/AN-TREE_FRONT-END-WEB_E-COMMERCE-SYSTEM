"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "antd";
import {
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  StarIcon,
  PlusIcon,
  FilterIcon,
  RefreshCcwIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  price: number;
  sku: number;
  sold: number;
  discountSold: number;
  discountPercent: number;
  coverImage: string;
  productFeedbackList: Array<{
    rate: number;
    total: number;
  }>;
}

const products: Product[] = [
  {
    id: "464e9b11-2e5f-4d88-917a-fe4ba1f863e5",
    name: "Premium Headphones",
    price: 250000,
    sku: 8,
    sold: 17,
    discountSold: 225000,
    discountPercent: 10,
    coverImage: "/placeholder.svg",
    productFeedbackList: [
      {
        rate: 4.5,
        total: 28,
      },
    ],
  },
  {
    id: "5204358b-a057-4302-9321-f97b7e5d4493",
    name: "Wireless Mouse",
    price: 150000,
    sku: 15,
    sold: 32,
    discountSold: 150000,
    discountPercent: 0,
    coverImage: "/placeholder.svg",
    productFeedbackList: [
      {
        rate: 4.2,
        total: 45,
      },
    ],
  },
  {
    id: "a482f427-c208-4159-8fab-f22891de0e6d",
    name: "4K Monitor",
    price: 3500000,
    sku: 5,
    sold: 7,
    discountSold: 2975000,
    discountPercent: 15,
    coverImage: "/placeholder.svg",
    productFeedbackList: [
      {
        rate: 4.8,
        total: 12,
      },
    ],
  },
  {
    id: "96a79c4f-dd05-4e62-83bc-f036999fa1b4",
    name: "Ergonomic Keyboard",
    price: 450000,
    sku: 20,
    sold: 25,
    discountSold: 405000,
    discountPercent: 10,
    coverImage: "/placeholder.svg",
    productFeedbackList: [
      {
        rate: 4.3,
        total: 36,
      },
    ],
  },
  {
    id: "539fda92-e604-4089-9e07-eebc781ab96f",
    name: "Wireless Earbuds",
    price: 180000,
    sku: 30,
    sold: 50,
    discountSold: 180000,
    discountPercent: 0,
    coverImage: "/placeholder.svg",
    productFeedbackList: [
      {
        rate: 4.1,
        total: 72,
      },
    ],
  },
];

export default function ProductsPage() {
  const [sortColumn, setSortColumn] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("all");
  const pageSize = 5;

  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortColumn) return 0;
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredProducts = sortedProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (filterDiscount === "all") return true;
      if (filterDiscount === "discount") return product.discountPercent > 0;
      if (filterDiscount === "no-discount")
        return product.discountPercent === 0;
      return true;
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const SortIcon = ({ column }: { column: keyof Product }) => {
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

  return (
    <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <Card className="w-full overflow-hidden border-t-4 border-purple-500 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" size="sm">
                <RefreshCcwIcon className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <div className="flex space-x-2">
                <Link href="/dashboard/products/new">
                  <Button variant="secondary" size="sm">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Thêm sản phẩm mới
                  </Button>
                </Link>
              </div>
              <Select value={filterDiscount} onValueChange={setFilterDiscount}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="discount">With Discount</SelectItem>
                  <SelectItem value="no-discount">No Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Price Range</DropdownMenuItem>
                <DropdownMenuItem>Rating</DropdownMenuItem>
                <DropdownMenuItem>Stock Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Image
                        src={product.coverImage}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {product.price.toLocaleString()} VND
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {(
                            product.price /
                            (1 - product.discountPercent / 100)
                          ).toFixed(0)}{" "}
                          VND
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {product.sold}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getDiscountColor(
                          product.discountPercent
                        )} px-2 py-1`}
                      >
                        {product.discountPercent}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <StarIcon className="mr-1 h-4 w-4 text-yellow-400" />
                        <span className="font-medium">
                          {product.productFeedbackList[0]?.rate.toFixed(1)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({product.productFeedbackList[0]?.total})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
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
