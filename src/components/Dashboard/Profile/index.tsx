import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { IUser } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  city: z.string().min(1, "Thành phố là bắt buộc"),
  province: z.string().min(1, "Tỉnh là bắt buộc"),
  phonenumber: z.string().min(1, "Số điện thoại là bắt buộc"),
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  bankOwnerName: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  bankAccountNumber: z.string().min(1, "Số tài khoản ngân hàng là bắt buộc"),
  avatarImage: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileFormProps {
  vendor: IUser;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  sendOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setIsEditing: (isEditing: boolean) => void;
}

export function EditProfileForm({
  vendor,
  onSubmit,
  onCancel,
  sendOtp,
  verifyOtp,
  setIsEditing,
}: EditProfileFormProps) {
  const [avatarPreview, setAvatarPreview] = useState(vendor.avatarImage);
  const [coverPreview, setCoverPreview] = useState(vendor.coverImage);
  const [otpCountdown, setOtpCountdown] = useState(120);
  const [otpValue, setOtpValue] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vendor.name,
      email: vendor.email,
      address: vendor.address,
      city: vendor.city,
      province: vendor.province,
      phonenumber: vendor.phonenumber,
      bankName: vendor.bankName,
      bankOwnerName: vendor.bankOwnerName,
      bankAccountNumber: vendor.bankAccountNumber,
      avatarImage: vendor.avatarImage,
      coverImage: vendor.coverImage,
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatarImage" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "avatarImage") {
          form.setValue("avatarImage", reader.result as string);
          setAvatarPreview(reader.result as string);
        } else {
          form.setValue("coverImage", reader.result as string);
          setCoverPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    onSubmit(form.getValues());
    if (requiresOtp(values)) {
      await sendOtp();
      setIsOtpDialogOpen(true);
      setOtpCountdown(120);
    } else {
      setIsEditing(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    const isValid = await verifyOtp(otpValue);
    if (isValid) {
      setIsOtpDialogOpen(false);
    } else {
      // Handle invalid OTP
      alert("Invalid OTP. Please try again.");
    }
    setIsEditing(false);
  };

  const requiresOtp = (values: FormValues) =>
    values.email !== vendor.email ||
    values.phonenumber !== vendor.phonenumber ||
    values.bankName !== vendor.bankName ||
    values.bankOwnerName !== vendor.bankOwnerName ||
    values.bankAccountNumber !== vendor.bankAccountNumber;

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <CardTitle className="text-3xl font-bold">
            Chỉnh sửa Hồ sơ của bạn
          </CardTitle>
          <p className="text-blue-100 mt-2">
            Cập nhật thông tin của bạn và làm nổi bật hồ sơ của bạn
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <ImageUploadSection
                avatarPreview={avatarPreview}
                coverPreview={coverPreview}
                handleImageChange={handleImageChange}
                form={form}
              />

              <ProfileTabs form={form} />

              <div className="flex justify-end space-x-4 mt-8">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Hủy
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <OtpDialog
        isOpen={isOtpDialogOpen}
        onOpenChange={setIsOtpDialogOpen}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
        otpCountdown={otpCountdown}
        handleOtpSubmit={handleOtpSubmit}
      />
    </div>
  );
}

function ImageUploadSection({
  avatarPreview,
  coverPreview,
  handleImageChange,
  form,
}: {
  avatarPreview: string;
  coverPreview: string;
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatarImage" | "coverImage"
  ) => void;
  form: any;
}) {
  return (
    <div className="space-y-6">
      <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
        {coverPreview && (
          <Image
            src={coverPreview}
            alt="Cover"
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        )}
        <InputFileUpload
          id="coverImage"
          handleImageChange={handleImageChange}
          type="coverImage"
          buttonText="Change Cover"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={avatarPreview} alt={form.watch("name")} />
          <AvatarFallback>{form.watch("name").charAt(0)}</AvatarFallback>
        </Avatar>
        <InputFileUpload
          id="avatarImage"
          handleImageChange={handleImageChange}
          type="avatarImage"
          buttonText="Change Avatar"
        />
      </div>
    </div>
  );
}

function InputFileUpload({
  id,
  handleImageChange,
  type,
  buttonText,
}: {
  id: string;
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatarImage" | "coverImage"
  ) => void;
  type: "avatarImage" | "coverImage";
  buttonText: string;
}) {
  return (
    <>
      <Input
        id={id}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageChange(e, type)}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById(id)?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        {buttonText}
      </Button>
    </>
  );
}

function ProfileTabs({ form }: { form: any }) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="bank">Bank Details</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-6 space-y-6">
        <PersonalInfoFields form={form} />
      </TabsContent>
      <TabsContent value="bank" className="mt-6 space-y-6">
        <BankInfoFields form={form} />
      </TabsContent>
    </Tabs>
  );
}

function PersonalInfoFields({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {["name", "email", "address", "city", "province", "phonenumber"].map(
        (fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 capitalize">
                  {fieldName}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      )}
    </div>
  );
}

function BankInfoFields({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {["bankName", "bankOwnerName", "bankAccountNumber"].map((fieldName) => (
        <FormField
          key={fieldName}
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 capitalize">
                {fieldName}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}

function OtpDialog({
  isOpen,
  onOpenChange,
  otpValue,
  setOtpValue,
  otpCountdown,
  handleOtpSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  otpValue: string;
  setOtpValue: (value: string) => void;
  otpCountdown: number;
  handleOtpSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              placeholder="Enter OTP"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Please enter the OTP sent to your email. Time remaining:{" "}
            <span className="font-bold text-destructive">{otpCountdown}s</span>
          </p>
          <Button type="submit" className="w-full">
            Submit OTP
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
