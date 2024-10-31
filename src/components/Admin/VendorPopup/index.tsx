"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  BanknoteIcon,
} from "lucide-react";

interface VendorDetailsPopupProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    province: string;
    phonenumber: string;
    bankName: string;
    bankOwnerName: string;
    bankAccountNumber: string;
    avatarImage: string;
    coverImage: string;
    createdOnUtc: string;
    modifiedOnUtc: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorDetailsPopup(
  { vendor, isOpen, onClose }: VendorDetailsPopupProps = {
    vendor: null,
    isOpen: false,
    onClose: () => void 0,
  }
) {
  if (!vendor) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Vendor Details</DialogTitle>
          <DialogDescription>
            Complete information about the vendor.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-6">
            <div className="relative h-48">
              <img
                src={
                  vendor.coverImage || "/placeholder.svg?height=192&width=600"
                }
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
              />
              <Avatar className="absolute -bottom-6 left-6 h-24 w-24 border-4 border-background">
                <AvatarImage src={vendor.avatarImage} alt={vendor.name} />
                <AvatarFallback>
                  {vendor.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="pt-8">
              <h3 className="text-2xl font-semibold">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground">{vendor.email}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection icon={MapPinIcon} title="Address">
                <p>{vendor.address}</p>
                <p>
                  {vendor.city}, {vendor.province}
                </p>
              </InfoSection>
              <InfoSection icon={PhoneIcon} title="Phone Number">
                <p>{vendor.phonenumber}</p>
              </InfoSection>
            </div>
            <Separator />
            <InfoSection icon={BanknoteIcon} title="Bank Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">Bank Name:</span>{" "}
                  {vendor.bankName}
                </p>
                <p>
                  <span className="font-medium">Account Owner:</span>{" "}
                  {vendor.bankOwnerName}
                </p>
                <p>
                  <span className="font-medium">Account Number:</span>{" "}
                  {vendor.bankAccountNumber}
                </p>
              </div>
            </InfoSection>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection icon={CalendarIcon} title="Created">
                <p>{formatDate(vendor.createdOnUtc)}</p>
              </InfoSection>
              <InfoSection icon={CalendarIcon} title="Last Modified">
                <p>{formatDate(vendor.modifiedOnUtc)}</p>
              </InfoSection>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm font-medium">
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
