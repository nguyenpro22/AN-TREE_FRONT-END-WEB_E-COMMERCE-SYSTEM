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
  MessageSquareIcon,
  StarIcon,
  PackageIcon,
  ClipboardIcon,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getStatusByCode, OrderDetailResponse } from "@/types";
import Image from "next/image";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/services/apis";

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
      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg_Color} ${statusInfo.txt_Color}`}
    >
      {statusInfo.description}
    </span>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={star <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

export default function OrderDetailCard() {
  const { id } = useParams();
  const { data: OrderDetail, isLoading } = useGetOrderByIdQuery(id as string);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!OrderDetail)
    return (
      <div className="flex justify-center items-center h-screen">
        Order not found
      </div>
    );
  const order = OrderDetail.value;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} has been copied to your clipboard.`);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-primary">Order Details</h1>
      <Card className="shadow-xl border-t-4 border-primary rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <CardTitle className="text-2xl flex justify-between items-center">
            <span className="flex items-center">
              <PackageIcon className="mr-2 h-6 w-6 text-primary" />
              Order #{order?.id?.slice(0, 8)}
            </span>
            <OrderStatusBadge status={order?.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Order Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ordered on:</span>
                  <span>{formatDate(order?.createdOnUtc)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    ${formatCurrency(order?.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <CreditCardIcon className="mr-2 h-5 w-5" />
                Order Details
              </h2>
              <div className="space-y-4">
                {order?.orderDetails?.map((detail) => (
                  <div
                    key={detail.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{detail.productName}</span>
                      <span className="bg-primary/10 px-2 py-1 rounded-full text-sm font-semibold text-primary">
                        x{detail.productQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Price per item:</span>
                      <span>${formatCurrency(detail.productPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold mt-2 pt-2 border-t">
                      <span>Subtotal:</span>
                      <span>
                        $
                        {formatCurrency(
                          detail.productPrice * detail.productQuantity
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Additional Sections */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {order?.address && (
              <AccordionItem
                value="address"
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="text-lg font-semibold text-primary p-4 hover:bg-gray-50">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  Shipping Address
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <span>{order?.address}</span>
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
            )}
            {order?.note && (
              <AccordionItem
                value="notes"
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="text-lg font-semibold text-primary p-4 hover:bg-gray-50">
                  <MessageSquareIcon className="mr-2 h-5 w-5" />
                  Additional Notes
                </AccordionTrigger>
                <AccordionContent>
                  <p className="p-4 bg-gray-50 text-gray-600">{order?.note}</p>
                </AccordionContent>
              </AccordionItem>
            )}
            {order?.isFeedback &&
              order?.orderDetails[0]?.orderDetailFeedback && (
                <AccordionItem
                  value="feedback"
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-lg font-semibold text-primary p-4 hover:bg-gray-50">
                    <StarIcon className="mr-2 h-5 w-5" />
                    Customer Feedback
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 space-y-4">
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="mt-1 text-gray-600">
                          {order?.orderDetails[0]?.orderDetailFeedback?.content}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Rating:</span>
                        <StarRating
                          rating={
                            order?.orderDetails[0]?.orderDetailFeedback?.rating
                          }
                        />
                      </div>
                      <div>
                        <span className="font-medium">Images:</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {order.orderDetails[0].orderDetailFeedback.orderDetailFeedbackMedia.map(
                            (imageUrl: string, index: number) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden shadow-sm"
                              >
                                <Image
                                  src={imageUrl}
                                  alt={`Feedback image ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
