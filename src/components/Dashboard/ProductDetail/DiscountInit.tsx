"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Pencil,
  Trash2,
  Plus,
  Clock,
} from "lucide-react";
import {
  useGetProductDiscountsQuery,
  useCreateProductDiscountMutation,
  useUpdateProductDiscountMutation,
  useDeleteProductDiscountMutation,
} from "@/services/apis";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDiscount, IDiscountResponse } from "@/types/DiscountType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDiscountManagementProps {
  productId: string;
}

const initialDiscountState: Omit<IDiscount, "productId" | "type"> = {
  name: "",
  description: "",
  discountPercent: 0,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
};

export default function ProductDiscountManagement({
  productId,
}: ProductDiscountManagementProps) {
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [editingDiscount, setEditingDiscount] =
    useState<IDiscountResponse | null>(null);
  const [newDiscount, setNewDiscount] = useState(initialDiscountState);

  const {
    data: discountsResponse,
    isLoading,
    refetch,
  } = useGetProductDiscountsQuery({ productId });
  const [createDiscount] = useCreateProductDiscountMutation();
  const [updateDiscount] = useUpdateProductDiscountMutation();
  const [deleteDiscount] = useDeleteProductDiscountMutation();

  useEffect(() => {
    if (isAddingDiscount) {
      setNewDiscount(initialDiscountState);
    }
  }, [isAddingDiscount]);

  const handleAddDiscount = async () => {
    try {
      const discountToAdd: Omit<IDiscount, "type"> = {
        ...newDiscount,
        productId,
      };
      const response = await createDiscount(discountToAdd).unwrap();
      if (response.isSuccess) {
        toast.success("Discount added successfully");
        setIsAddingDiscount(false);
        refetch();
      } else {
        toast.error(response?.error?.message || "Failed to add discount");
      }
    } catch (error) {
      toast.error("Failed to add discount");
    }
  };

  const handleUpdateDiscount = async () => {
    if (editingDiscount) {
      const { id, createdOnUtc, type, ...updateData } = editingDiscount;
      await updateDiscount({
        ...updateData,
        productDiscountId: id,
      }).unwrap();
      toast.success("Discount updated successfully");
      setEditingDiscount(null);
      refetch();
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id).unwrap();
      toast.success("Discount deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete discount");
    }
  };

  const renderDiscountForm = (
    discount: Omit<IDiscount, "type" | "productId"> | IDiscountResponse,
    isEditing: boolean
  ) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${isEditing ? "edit" : "new"}Name`}>Name</Label>
        <Input
          id={`${isEditing ? "edit" : "new"}Name`}
          value={discount.name}
          onChange={(e) =>
            isEditing
              ? setEditingDiscount({
                  ...editingDiscount!,
                  name: e.target.value,
                })
              : setNewDiscount({ ...newDiscount, name: e.target.value })
          }
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${isEditing ? "edit" : "new"}Description`}>
          Description
        </Label>
        <Textarea
          id={`${isEditing ? "edit" : "new"}Description`}
          value={discount.description}
          onChange={(e) =>
            isEditing
              ? setEditingDiscount({
                  ...editingDiscount!,
                  description: e.target.value,
                })
              : setNewDiscount({ ...newDiscount, description: e.target.value })
          }
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${isEditing ? "edit" : "new"}DiscountPercent`}>
          Discount Percent
        </Label>
        <Input
          id={`${isEditing ? "edit" : "new"}DiscountPercent`}
          type="number"
          min="0"
          max="100"
          value={discount.discountPercent}
          onChange={(e) => {
            const value = Math.min(100, Math.max(0, Number(e.target.value)));
            isEditing
              ? setEditingDiscount({
                  ...editingDiscount!,
                  discountPercent: value,
                })
              : setNewDiscount({ ...newDiscount, discountPercent: value });
          }}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Start Time</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(discount.startTime), "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(discount.startTime)}
                onSelect={(date) =>
                  date &&
                  (isEditing
                    ? setEditingDiscount({
                        ...editingDiscount!,
                        startTime: new Date(
                          date.setHours(
                            new Date(editingDiscount!.startTime).getHours(),
                            new Date(editingDiscount!.startTime).getMinutes()
                          )
                        ).toISOString(),
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        startTime: new Date(
                          date.setHours(
                            new Date(newDiscount.startTime).getHours(),
                            new Date(newDiscount.startTime).getMinutes()
                          )
                        ).toISOString(),
                      }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                {format(new Date(discount.startTime), "HH:mm")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(":").map(Number);
                    const newDate = new Date(discount.startTime);
                    newDate.setHours(hours, minutes);
                    isEditing
                      ? setEditingDiscount({
                          ...editingDiscount!,
                          startTime: newDate.toISOString(),
                        })
                      : setNewDiscount({
                          ...newDiscount,
                          startTime: newDate.toISOString(),
                        });
                  }}
                  defaultValue={format(new Date(discount.startTime), "HH:mm")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 * 4 }).map((_, index) => {
                      const hours = Math.floor(index / 4);
                      const minutes = (index % 4) * 15;
                      const time = `${hours
                        .toString()
                        .padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label>End Time</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(discount.endTime), "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(discount.endTime)}
                onSelect={(date) =>
                  date &&
                  (isEditing
                    ? setEditingDiscount({
                        ...editingDiscount!,
                        endTime: new Date(
                          date.setHours(
                            new Date(editingDiscount!.endTime).getHours(),
                            new Date(editingDiscount!.endTime).getMinutes()
                          )
                        ).toISOString(),
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        endTime: new Date(
                          date.setHours(
                            new Date(newDiscount.endTime).getHours(),
                            new Date(newDiscount.endTime).getMinutes()
                          )
                        ).toISOString(),
                      }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                {format(new Date(discount.endTime), "HH:mm")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(":").map(Number);
                    const newDate = new Date(discount.endTime);
                    newDate.setHours(hours, minutes);
                    isEditing
                      ? setEditingDiscount({
                          ...editingDiscount!,
                          endTime: newDate.toISOString(),
                        })
                      : setNewDiscount({
                          ...newDiscount,
                          endTime: newDate.toISOString(),
                        });
                  }}
                  defaultValue={format(new Date(discount.endTime), "HH:mm")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 * 4 }).map((_, index) => {
                      const hours = Math.floor(index / 4);
                      const minutes = (index % 4) * 15;
                      const time = `${hours
                        .toString()
                        .padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Product Discounts</CardTitle>
        <Button onClick={() => setIsAddingDiscount(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Discount
        </Button>
      </CardHeader>
      <CardContent>
        {discountsResponse?.value.items.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No discounts available for this product.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Discount Percent</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountsResponse?.value.items.map(
                  (discount: IDiscountResponse) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-medium">
                        {discount.name}
                      </TableCell>
                      <TableCell>{discount.discountPercent}%</TableCell>
                      <TableCell>
                        {format(new Date(discount.startTime), "PPP HH:mm")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(discount.endTime), "PPP HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDiscount(discount)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isAddingDiscount} onOpenChange={setIsAddingDiscount}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Discount</DialogTitle>
            </DialogHeader>
            {renderDiscountForm({ ...newDiscount }, false)}
            <DialogFooter>
              <Button onClick={handleAddDiscount} className="w-full">
                Add Discount
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editingDiscount}
          onOpenChange={(open) => !open && setEditingDiscount(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Discount</DialogTitle>
            </DialogHeader>
            {editingDiscount && renderDiscountForm(editingDiscount, true)}
            <DialogFooter>
              <Button onClick={handleUpdateDiscount} className="w-full">
                Update Discount
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
