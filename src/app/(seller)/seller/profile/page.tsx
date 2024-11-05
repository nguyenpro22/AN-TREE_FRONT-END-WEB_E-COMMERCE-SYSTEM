"use client";

import React, { useState, useEffect } from "react";
import {
  useLazyGetVendorProfileQuery,
  useUpdateVendorMutation,
} from "@/services/apis";
import { getAccessToken } from "@/utils";
import { IUser } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { EditProfileForm } from "@/components/Dashboard/Profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Building,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setVendor } from "@/redux/store/slices/vendorSlice";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  phonenumber: z.string().min(1, "Phone number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankOwnerName: z.string().min(1, "Bank owner name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
});

function ProfileCard({
  vendor,
  onEdit,
}: {
  vendor: IUser | null;
  onEdit: () => void;
}) {
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-background shadow-lg">
      <ProfileHeader vendor={vendor} />
      <CardContent className="pt-6">
        <ProfileTabs vendor={vendor} />
        <div className="mt-8 flex justify-center">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-500"
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileHeader({ vendor }: { vendor: IUser | null }) {
  return (
    <div className="relative h-60 md:h-80">
      <Image
        src={vendor?.coverImage || "/default-cover-image.jpg"}
        alt="Cover"
        className="w-full h-full object-cover"
        width={900}
        height={300}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute bottom-4 left-4 flex items-end space-x-4">
        <Avatar className="w-24 h-24 border-4 border-background">
          <AvatarImage src={vendor?.avatarImage} alt={vendor?.name} />
          <AvatarFallback>{vendor?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            {vendor?.name}
          </h2>
          <p className="text-white/80 drop-shadow-md flex items-center">
            <Mail className="w-4 h-4 mr-1" /> {vendor?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileTabs({ vendor }: { vendor: IUser | null }) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="bank">Bank Details</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-6 space-y-6">
        <ProfileFields vendor={vendor} />
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            Member since:{" "}
            {new Date(vendor?.createdOnUtc ?? "").toLocaleDateString()}
          </span>
        </div>
      </TabsContent>
      <TabsContent value="bank" className="mt-6 space-y-6">
        <BankDetails vendor={vendor} />
      </TabsContent>
    </Tabs>
  );
}

function ProfileFields({ vendor }: { vendor: IUser | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileField
        icon={MapPin}
        label="Address"
        value={vendor?.address ?? "N/A"}
      />
      <ProfileField
        icon={Building}
        label="City"
        value={vendor?.city ?? "N/A"}
      />
      <ProfileField
        icon={MapPin}
        label="Province"
        value={vendor?.province ?? "N/A"}
      />
      <ProfileField
        icon={Phone}
        label="Phone Number"
        value={vendor?.phonenumber ?? "N/A"}
      />
    </div>
  );
}
type FormValues = z.infer<typeof formSchema>;

export default function UserProfile() {
  const vendor = useSelector(
    (state: RootState) => state.vendor.vendor
  ) as IUser;
  const [getVendorProfile] = useLazyGetVendorProfileQuery();
  const [updateVendorProfile] = useUpdateVendorMutation();
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vendor?.name || "",
      email: vendor?.email || "",
      address: vendor?.address || "",
      city: vendor?.city || "",
      province: vendor?.province || "",
      phonenumber: vendor?.phonenumber || "",
      bankName: vendor?.bankName || "",
      bankOwnerName: vendor?.bankOwnerName || "",
      bankAccountNumber: vendor?.bankAccountNumber || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await updateVendorProfile(formData).unwrap();

      if (res) {
        dispatch(setVendor({ ...vendor, ...values } as IUser));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating vendor profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const sendOtp = async () => {
    // Implement OTP sending logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("OTP sent to your email");
  };

  const verifyOtp = async (otpValue: string) => {
    // Implement OTP verification logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <div className="container mx-auto p-4">
      {isEditing && vendor ? (
        <EditProfileForm
          vendor={vendor}
          onSubmit={onSubmit}
          onCancel={() => setIsEditing(false)}
          sendOtp={sendOtp}
          verifyOtp={verifyOtp}
          setIsEditing={setIsEditing}
        />
      ) : (
        <ProfileCard vendor={vendor} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
function BankDetails({ vendor }: { vendor: IUser | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileField
        icon={Building}
        label="Bank Name"
        value={vendor?.bankName ?? "N/A"}
      />
      <ProfileField
        icon={CreditCard}
        label="Account Owner"
        value={vendor?.bankOwnerName ?? "N/A"}
      />
      <ProfileField
        icon={CreditCard}
        label="Account Number"
        value={vendor?.bankAccountNumber ?? "N/A"}
      />
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </Label>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}
