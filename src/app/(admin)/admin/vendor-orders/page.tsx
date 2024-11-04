"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { OrderStatus, OrderStatusType } from "@/types";
import { useGetOrdersAdminQuery } from "@/services/apis";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/utils";

const statusMap: Record<number, OrderStatusType> = {
  0: OrderStatus[0],
  1: OrderStatus[1],
  2: OrderStatus[2],
};

const PAGE_SIZE = 7;

export default function OrderManagement() {
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: ordersData,
    refetch,
    isLoading,
    isFetching,
    isError,
  } = useGetOrdersAdminQuery({
    pageIndex: currentPage,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const filteredOrders =
    ordersData?.value?.items?.filter((order) => {
      const vendorMatch =
        selectedVendor === "all" || order.vendorName === selectedVendor;
      const searchMatch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
      return vendorMatch && searchMatch;
    }) || [];

  const totalPages = Math.ceil(
    (ordersData?.value?.totalCount || 0) / PAGE_SIZE
  );

  const uniqueVendors = Array.from(
    new Set(ordersData?.value?.items?.map((order) => order.vendorName) || [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <CardHeader className="pb-2"></CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Select onValueChange={setSelectedVendor} value={selectedVendor}>
              <SelectTrigger className="w-full sm:w-[200px] rounded-md">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {uniqueVendors.map((vendor) => (
                  <SelectItem key={vendor} value={vendor}>
                    {vendor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 w-full sm:w-[350px] rounded-md"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto rounded-md"
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="rounded-md border overflow-hidden shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold ">Order ID</TableHead>
                <TableHead className="font-semibold">Vendor</TableHead>
                <TableHead className="font-semibold ">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="hidden md:table-cell font-semibold ">
                  Created On
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    Error loading orders. Please try again.
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow
                    key={order.orderId}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-muted/50"
                    } hover:bg-muted transition-colors`}
                  >
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>{order.vendorName}</TableCell>
                    <TableCell>{formatMoney(order.total)} VNĐ</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          statusMap[order.status as keyof typeof statusMap]
                            ?.bg_Color
                        } px-2 py-0.5 rounded-full text-xs font-semibold`}
                      >
                        {statusMap[order.status as keyof typeof statusMap]
                          ?.description || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(order.createdOnUtc)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
