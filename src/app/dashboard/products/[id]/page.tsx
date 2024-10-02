"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

type FormData = {
  productCategoryId: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  sold: number;
  coverImage: File | null;
  productImageList: File[];
};

const CustomColorPicker = ({
  onChange,
}: {
  onChange: (color: string) => void;
}) => {
  const [color, setColor] = useState("#000000");

  const handleColorChange = useCallback(
    (newColor: string) => {
      setColor(newColor);
      onChange(newColor);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-8 h-8 p-0">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={handleColorChange} />
      </PopoverContent>
    </Popover>
  );
};

export default function ProductForm() {
  const { register, handleSubmit, control, setValue } = useForm<FormData>();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [productImagesPreview, setProductImagesPreview] = useState<string[]>(
    []
  );

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description || "");
    formData.append("sku", data.sku);
    formData.append("sold", data.sold.toString());

    if (data.coverImage) {
      formData.append("productImageCover", data.coverImage);
    }

    if (data.productImageList && data.productImageList.length > 0) {
      Array.from(data.productImageList).forEach((image) => {
        formData.append(`productImages`, image);
      });
    }

    // Here you would typically send the formData to your API
    console.log("Form Data:", Object.fromEntries(formData));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("coverImage", file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      setValue("productImageList", Array.from(files));
      setProductImagesPreview(
        Array.from(files).map((file) => URL.createObjectURL(file))
      );
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
        [{ color: [] }],
      ],
      handlers: {
        color: function (value: string) {
          const quill = (this as any).quill;
          quill.format("color", value);
        },
      },
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Thêm Sản Phẩm Mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-6"
        >
          {/* Left column: Category, Name, Price */}
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="productCategoryId">Danh Mục Sản Phẩm</Label>
              <Select
                onValueChange={(value) => setValue("productCategoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Danh Mục 1</SelectItem>
                  <SelectItem value="2">Danh Mục 2</SelectItem>
                  <SelectItem value="3">Danh Mục 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Tên Sản Phẩm</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>

            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="sku">Mã SKU</Label>
              <Input id="sku" {...register("sku", { required: true })} />
            </div>

            <div>
              <Label htmlFor="sold">Đã Bán</Label>
              <Input
                id="sold"
                type="number"
                {...register("sold", { required: true, valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Middle column: Description (Rich Text Editor) */}
          <div className="col-span-8">
            <Label htmlFor="description">Mô Tả Sản Phẩm</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={modules}
                    formats={formats}
                    className="h-[360px] mb-12"
                  />
                </div>
              )}
            />
          </div>

          {/* Right column: SKU, Sold, Cover Image, Product Images */}
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="coverImage">Ảnh Bìa</Label>
              <Input
                id="coverImage"
                type="file"
                onChange={handleCoverImageChange}
                className="mb-2"
              />
              {coverImagePreview && (
                <img
                  src={coverImagePreview}
                  alt="Xem trước ảnh bìa"
                  className="max-w-full h-auto"
                />
              )}
            </div>

            <div>
              <Label htmlFor="productImages">Ảnh Sản Phẩm</Label>
              <Input
                id="productImages"
                type="file"
                multiple
                onChange={handleProductImagesChange}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                {productImagesPreview.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Ảnh sản phẩm ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit button - full width */}
          <div className="col-span-12">
            <Button type="submit" className="w-full">
              Thêm Sản Phẩm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
