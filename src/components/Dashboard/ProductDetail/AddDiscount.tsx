"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { IDiscount } from "@/types/DiscountType";
import { useCreateProductDiscountMutation } from "@/services/apis";

interface AddNewDiscountProps {
  productId: string;
}

const initialDiscountState: Omit<
  IDiscount,
  "productId" | "type" | "startTime" | "endTime"
> = {
  name: "",
  description: "",
  discountPercent: 0,
};

export default function AddNewDiscountForm({ productId }: AddNewDiscountProps) {
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState(initialDiscountState);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [createDiscount] = useCreateProductDiscountMutation();

  const handleAddDiscount = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      const discountToAdd = {
        ...newDiscount,
        productId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };
      const response = await createDiscount(discountToAdd).unwrap();
      if (response.isSuccess) {
        toast.success("Discount added successfully");
        setIsAddingDiscount(false);
      } else {
        toast.error("Failed to add discount");
      }
    } catch (error) {
      toast.error("Failed to add discount");
    }
  };

  return (
    <>
      <Button onClick={() => setIsAddingDiscount(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add New Discount
      </Button>

      <Dialog open={isAddingDiscount} onOpenChange={setIsAddingDiscount}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Discount</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newDiscount.name}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, name: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newDiscount.description}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    description: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Percent</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newDiscount.discountPercent}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    discountPercent: Math.min(
                      100,
                      Math.max(0, Number(e.target.value))
                    ),
                  })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "HH:mm") : "Select time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex flex-col space-y-2 p-2">
                    <Select
                      onValueChange={(value) => {
                        const [hours, minutes] = value.split(":").map(Number);
                        const updatedDate = startDate
                          ? new Date(startDate)
                          : new Date();
                        updatedDate.setHours(hours, minutes);
                        setStartDate(updatedDate);
                      }}
                      defaultValue={startDate ? format(startDate, "HH:mm") : ""}
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

          <DialogFooter>
            <Button onClick={handleAddDiscount} className="w-full">
              Add Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
