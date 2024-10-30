"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { IDiscount, IDiscountResponse, IPutDiscount } from "@/types";
import {
  useCreateProductDiscountMutation,
  useDeleteProductDiscountMutation,
  useGetProductDiscountsQuery,
  useUpdateProductDiscountMutation,
} from "@/services/apis";
import toast from "react-hot-toast";

export default function TypedDiscountManagement({ id }: { id: string }) {
  const {
    data: discounts,
    isLoading,
    refetch,
  } = useGetProductDiscountsQuery({
    productId: id,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [create] = useCreateProductDiscountMutation();
  const [update] = useUpdateProductDiscountMutation();
  const [remove] = useDeleteProductDiscountMutation();
  const [currentDiscount, setCurrentDiscount] =
    useState<IDiscountResponse | null>(null);

  const handleCreate = async (newDiscount: IDiscount) => {
    try {
      const res = await create({ ...newDiscount, productId: id });
      toast.success(res.data?.value as string);
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAddOpen(false);
    }
  };

  const handleEdit = async (updatedDiscount: IPutDiscount) => {
    try {
      await update({ ...updatedDiscount, productDiscountId: id });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditOpen(false);
    }
    setIsEditOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Discount
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
              </DialogHeader>
              <DiscountForm
                onSubmit={(discount) => handleCreate(discount)}
                onCancel={() => setIsAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts?.value.items
                .filter((d) => !d.isDeleted)
                .map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">
                      {discount.name}
                    </TableCell>
                    <TableCell>{discount.discountPercent}%</TableCell>
                    <TableCell>
                      {new Date(discount.startTime).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(discount.endTime).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentDiscount(discount);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the discount code{" "}
                              {discount.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(discount.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>
          {currentDiscount && (
            <DiscountForm
              discount={currentDiscount}
              onSubmit={(updatedDiscount) =>
                handleEdit({
                  ...updatedDiscount,
                  isDeleted: currentDiscount.isDeleted,
                  productDiscountId: currentDiscount.id,
                })
              }
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DiscountFormProps {
  discount?: IDiscountResponse;
  onSubmit: (discount: IDiscount) => void;
  onCancel: () => void;
}

function DiscountForm({ discount, onSubmit, onCancel }: DiscountFormProps) {
  const [name, setName] = useState(discount?.name || "");
  const [description, setDescription] = useState(discount?.description || "");
  const [discountPercent, setDiscountPercent] = useState(
    discount?.discountPercent.toString() || ""
  );
  const [startTime, setStartTime] = useState(
    discount
      ? new Date(discount.startTime).toISOString().split("T")[0]
      : new Date(Date.now()).toISOString().split("T")[0]
  );
  const [endTime, setEndTime] = useState(
    discount
      ? new Date(discount.endTime).toISOString().split("T")[0]
      : new Date(Date.now()).toISOString().split("T")[0]
  );
  const [productId, setProductId] = useState(discount?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      discountPercent: parseInt(discountPercent),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      productId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Discount Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="discountPercent">Discount Percentage</Label>
        <Input
          id="discountPercent"
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="date"
          value={startTime}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setStartTime(date.toISOString().split("T")[0]);
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="date"
          value={endTime}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setEndTime(date.toISOString().split("T")[0]);
          }}
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {discount ? "Update Discount" : "Create Discount"}
        </Button>
      </DialogFooter>
    </form>
  );
}
