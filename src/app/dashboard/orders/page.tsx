"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusByCode, Order } from "@/types";
import { formatCurrency } from "@/utils";
import { useGetOrdersQuery } from "@/services/apis/OrderAPI";
import { TableRowSkeleton } from "@/components/Skeleton";

const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy");
};

const renderOrderStatus = (status: number) => {
  const statusInfo = getStatusByCode(status);
  if (!statusInfo) return null;

  return (
    <Badge
      variant="outline"
      className={`${statusInfo.bg_Color} ${statusInfo.txt_Color}`}
    >
      {statusInfo.description}
    </Badge>
  );
};

export default function EnhancedOrdersPage() {
  const [sortColumn, setSortColumn] = useState<keyof Order>("createdOnUtc");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const {
    data: ordersData,
    error,
    isLoading,
  } = useGetOrdersQuery({
    pageIndex: 1,
    pageSize: 1000, // Fetch a large number of orders to handle client-side pagination
    sortColumn: sortColumn,
    sortOrder: sortDirection,
  });

  const filteredOrders = useMemo(() => {
    if (!ordersData || !ordersData.value?.items) return [];

    return ordersData.value.items.filter((order) => {
      const searchString = `${order.id} ${order.user.firstname} ${
        order.user.lastname
      } ${order.total} ${
        getStatusByCode(order.status)?.description
      }`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [ordersData, searchTerm]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      const aValue = a[sortColumn] ?? "";
      const bValue = b[sortColumn] ?? "";
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortColumn, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return sortedOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [sortedOrders, currentPage]);

  const totalOrders = filteredOrders.length;

  const handleSort = (column: keyof Order) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="mb-6 shadow-lg">
        <CardContent className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders..."
                className="pl-8 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10 hover:bg-primary/20 transition duration-200">
                  <TableHead
                    className="font-bold text-primary cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    Order ID{" "}
                    {sortColumn === "id" &&
                      (sortDirection === "asc" ? (
                        <ChevronUpIcon className="inline" />
                      ) : (
                        <ChevronDownIcon className="inline" />
                      ))}
                  </TableHead>
                  <TableHead className="font-bold text-primary">
                    Customer
                  </TableHead>
                  <TableHead
                    className="font-bold text-primary cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    Total{" "}
                    {sortColumn === "total" &&
                      (sortDirection === "asc" ? (
                        <ChevronUpIcon className="inline" />
                      ) : (
                        <ChevronDownIcon className="inline" />
                      ))}
                  </TableHead>
                  <TableHead className="font-bold text-primary">
                    Status
                  </TableHead>
                  <TableHead
                    className="font-bold text-primary cursor-pointer"
                    onClick={() => handleSort("createdOnUtc")}
                  >
                    Created On{" "}
                    {sortColumn === "createdOnUtc" &&
                      (sortDirection === "asc" ? (
                        <ChevronUpIcon className="inline" />
                      ) : (
                        <ChevronDownIcon className="inline" />
                      ))}
                  </TableHead>
                  <TableHead className="font-bold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(ordersPerPage)
                    .fill(0)
                    .map((_, index) => <TableRowSkeleton key={index} />)
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-red-500">
                      Error loading orders
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-secondary/10 transition duration-200"
                    >
                      <TableCell className="font-medium">
                        {order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{`${order.user.firstname} ${order.user.lastname}`}</TableCell>
                      <TableCell>${formatCurrency(order.total)}</TableCell>
                      <TableCell>{renderOrderStatus(order.status)}</TableCell>
                      <TableCell>{formatDate(order.createdOnUtc)}</TableCell>
                      <TableCell>
                        <Button variant="link" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `Showing ${(currentPage - 1) * ordersPerPage + 1} to ${Math.min(
                  currentPage * ordersPerPage,
                  totalOrders
                )} of ${totalOrders} orders`
              )}
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage * ordersPerPage >= totalOrders || isLoading
                }
                className="ml-2"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
