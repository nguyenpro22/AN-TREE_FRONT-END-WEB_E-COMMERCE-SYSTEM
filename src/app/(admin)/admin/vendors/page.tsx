"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  View,
  Loader2,
} from "lucide-react";
import { useGetVendorsQuery } from "@/services/apis";
import { Skeleton } from "@/components/ui/skeleton";
import VendorDetailsPopup from "@/components/Admin/VendorPopup";

const PAGE_SIZE = 6;

interface Vendor {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  avatarImage: string;
  createdOnUtc: string;
  address: string;
  city: string;
  province: string;
  bankName: string;
  bankOwnerName: string;
  bankAccountNumber: string;
  coverImage: string;
  modifiedOnUtc: string;
}

export default function VendorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {
    data: vendorsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetVendorsQuery({
    searchTerm,
    pageIndex: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = useMemo(
    () => Math.ceil((vendorsData?.value?.totalCount || 0) / PAGE_SIZE),
    [vendorsData?.value?.totalCount]
  );

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      refetch();
    },
    [refetch]
  );

  const handleViewVendor = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsPopupOpen(true);
  }, []);

  useEffect(() => {
    if (vendorsData?.value?.items) {
      setFilteredVendors(vendorsData.value.items);
    }
  }, [vendorsData?.value?.items]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    Error loading vendors. Please try again.
                  </TableCell>
                </TableRow>
              ) : filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No vendors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={vendor.avatarImage}
                          alt={vendor.name}
                        />
                        <AvatarFallback>
                          {vendor.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {vendor.phonenumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(vendor.createdOnUtc)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleViewVendor(vendor)}
                      >
                        <View className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading || isFetching}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading || isFetching}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
      <VendorDetailsPopup
        vendor={selectedVendor || null}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </Card>
  );
}
