// Base discount type
type BaseDiscount = {
  name: string;
  description: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
};

type DiscountType =
  | { type: "create"; productId: string }
  | { type: "response"; id: string; createdOnUtc: string; isDeleted: boolean }
  | { type: "update"; productDiscountId: string; isDeleted: boolean };

export type CreateDiscountType<T extends DiscountType["type"]> = BaseDiscount &
  Extract<DiscountType, { type: T }> &
  Omit<Extract<DiscountType, { type: T }>, "type">;

export type IDiscount = CreateDiscountType<"create">;
export type IDiscountResponse = CreateDiscountType<"response">;
export type IPutDiscount = CreateDiscountType<"update">;
