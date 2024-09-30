"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  RefreshCw,
  Download,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getStatusByCode, Order, OrderStatus } from "@/types";
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

const orders: Order[] = [
  {
    id: "3eda9572-b953-4bb7-8d0a-eac855c42f5d",
    address: "123 Main St, Anytown, AN 12345",
    note: "Please leave at the door",
    total: 20000,
    status: OrderStatus[3].status,
    isFeedback: false,
    createdOnUtc: "2024-09-28T18:29:15.98459+00:00",
    discount: null,
    user: {
      email: "john.doe@example.com",
      username: "johndoe",
      firstname: "John",
      lastname: "Doe",
      phonenumber: "+1 (555) 123-4567",
    },
  },
  {
    id: "5fba9572-c953-4cc7-9d0b-fbc855c42f5e",
    address: "456 Elm St, Somewhere, SW 67890",
    note: "",
    total: 15000,
    status: OrderStatus[2].status,
    isFeedback: true,
    createdOnUtc: "2024-09-29T10:15:30.12345+00:00",
    discount: 1000,
    user: {
      email: "jane.smith@example.com",
      username: "janesmith",
      firstname: "Jane",
      lastname: "Smith",
      phonenumber: "+1 (555) 987-6543",
    },
  },
  {
    id: "7abc1234-d456-4ee8-af0c-0de123f45g6h",
    address: "789 Oak St, Elsewhere, EL 13579",
    note: "Call before delivery",
    total: 30000,
    status: OrderStatus[1].status,
    isFeedback: false,
    createdOnUtc: "2024-09-30T14:45:00.67890+00:00",
    discount: null,
    user: {
      email: "bob.johnson@example.com",
      username: "bobjohnson",
      firstname: "Bob",
      lastname: "Johnson",
      phonenumber: "+1 (555) 246-8135",
    },
  },
];

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

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return sortDirection === "asc"
      ? (aValue ?? "") < (bValue ?? "")
        ? -1
        : 1
      : (aValue ?? "") > (bValue ?? "")
      ? -1
      : 1;
  });

  const filteredOrders = sortedOrders.filter((order) => {
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                {currentOrders.map((order) => (
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
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>
            <Pagination
              current={currentPage}
              total={filteredOrders.length}
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
