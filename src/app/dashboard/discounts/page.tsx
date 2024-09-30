import React from "react";
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

// TODO: Define proper types for discount vouchers
type DiscountVoucher = {
  id: string;
  code: string;
  discount: number;
  validUntil: string;
};

export default function DiscountVouchersPage() {
  // TODO: Fetch discount vouchers from API
  const discountVouchers: DiscountVoucher[] = [
    { id: "1", code: "SUMMER10", discount: 10, validUntil: "2023-08-31" },
    { id: "2", code: "WELCOME20", discount: 20, validUntil: "2023-12-31" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discount Vouchers</h1>
        <Link href="/dashboard/discounts/new">
          <Button>Create New Voucher</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discountVouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell>{voucher.code}</TableCell>
              <TableCell>{voucher.discount}%</TableCell>
              <TableCell>{voucher.validUntil}</TableCell>
              <TableCell>
                <Link href={`/dashboard/discounts/${voucher.id}`}>Edit</Link>
                <Button variant="destructive" size="sm" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
