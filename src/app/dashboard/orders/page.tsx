"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  Filter,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusByCode, Order } from "@/types";
import { formatCurrency } from "@/utils";
import { Pagination } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetOrdersQuery } from "@/services/apis/OrderAPI";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const {
    data: ordersData,
    error,
    isLoading,
  } = useGetOrdersQuery({
    pageIndex: currentPage,
    pageSize: ordersPerPage,
    sortColumn: sortColumn,
    sortOrder: sortDirection,
  });

  const totalOrders = ordersData?.value?.totalCount || 0;

  const filteredOrders = useMemo(() => {
    const orders = ordersData?.value?.items || [];

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.user.firstname} ${order.user.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        getStatusByCode(order.status)?.description.toLowerCase() ===
          statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

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

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

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
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border rounded-md shadow-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Date Range</DropdownMenuItem>
                  <DropdownMenuItem>Price Range</DropdownMenuItem>
                  <DropdownMenuItem>Customer Type</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                {filteredOrders.map((order) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
              {Math.min(currentPage * ordersPerPage, totalOrders)} of{" "}
              {totalOrders} orders
            </p>
            <Pagination
              current={currentPage}
              total={totalOrders}
              pageSize={ordersPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
              size="small"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
