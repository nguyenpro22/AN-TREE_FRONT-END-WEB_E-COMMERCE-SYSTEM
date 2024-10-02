"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  MailIcon,
  ClipboardIcon,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getStatusByCode, Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const order: Order = {
  id: "3eda9572-b953-4bb7-8d0a-eac855c42f5d",
  address: "123 Main St, Anytown, AN 12345",
  note: "Please leave the package at the front door",
  total: 20000,
  status: 2,
  isFeedback: false,
  createdOnUtc: "2024-09-28T18:29:15.98459+00:00",
  discount: 1000,
  user: {
    email: "user@example.com",
    username: "johndoe",
    firstname: "John",
    lastname: "Doe",
    phonenumber: "+1 (555) 123-4567",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getUTCDate().toString().padStart(2, "0")}/${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getUTCFullYear()} ${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
}

const OrderStatusBadge: React.FC<{ status: number }> = ({ status }) => {
  const statusInfo = getStatusByCode(status);

  if (!statusInfo) return null;

  return (
    <span
      className={`px-2 py-1 rounded-full ${statusInfo.bg_Color} ${statusInfo.txt_Color}`}
    >
      {statusInfo.description}
    </span>
  );
};

export default function OrderDetailCard() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} has been copied to your clipboard.`);
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-primary">Order Details</h1>
      <Card className="shadow-lg border-t-4 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl flex justify-between items-center">
            <span>Order #{order.id.slice(0, 8)}</span>
            <OrderStatusBadge status={order.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Order Information
              </h2>
              <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Ordered on:</span>
                </div>
                <span>{formatDate(order.createdOnUtc)}</span>
              </div>
              <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Total:</span>
                </div>
                <span>${formatCurrency(order.total)}</span>
              </div>
              {order.discount && (
                <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium text-green-700">
                      Discount:
                    </span>
                  </div>
                  <span className="text-green-700">
                    -${formatCurrency(order.discount)}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Customer Information
              </h2>
              <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Name:</span>
                </div>
                <span>{`${order.user.firstname} ${order.user.lastname}`}</span>
              </div>
              <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <PhoneIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Phone:</span>
                </div>
                <span>{order.user.phonenumber}</span>
              </div>
              <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <MailIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Email:</span>
                </div>
                <span className="truncate max-w-[200px]">
                  {order.user.email}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="address">
              <AccordionTrigger>Shipping Address</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5 text-primary" />
                    <span>{order.address}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(order.address, "Address")}
                  >
                    <ClipboardIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="notes">
              <AccordionTrigger>Additional Notes</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground p-3 bg-secondary/10 rounded-lg">
                  {order.note || "No additional notes provided."}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
