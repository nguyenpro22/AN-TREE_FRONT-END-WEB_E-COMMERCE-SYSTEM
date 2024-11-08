// Base vendor type with common properties
type BaseVendor = {
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
};

// Define different vendor type variations
type VendorType =
  | { type: "create" }
  | {
      type: "response";
      id: string;
      createdOnUtc: string;
      modifiedOnUtc: string;
    }
  | {
      type: "list";
      id: string;
      status: number;
      isDeleted: number;
      createdOnUtc: string;
      modifiedOnUtc: string;
    };

// Generic type to create specific vendor types
export type CreateVendorType<T extends VendorType["type"]> = BaseVendor &
  Omit<Extract<VendorType, { type: T }>, "type">;

// Export specific vendor types
export type Vendor = CreateVendorType<"create">;
export type VendorResponse = CreateVendorType<"response">;
export type Vendors = CreateVendorType<"list">;
