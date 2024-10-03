"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
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
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import type { RcFile } from "rc-upload/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetProductByIdQuery,
} from "@/services/apis";
import { getAccessToken, GetDataByToken } from "@/utils";
import ColorfulButton from "@/components/Auth/ColorfulButton";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/Dashboard/ProductDetail";
import { IProductDetail } from "@/types";

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
const formSchema = z.object({
  productCategoryId: z.string().min(1, "Danh mục sản phẩm là bắt buộc"),
  name: z
    .string()
    .min(1, "Tên sản phẩm là bắt buộc")
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  price: z.number().positive("Giá phải là số dương"),
  description: z.string().optional(),
  sku: z.string().min(1, "Mã SKU là bắt buộc"),
  sold: z.number().nonnegative("Số lượng đã bán không thể âm"),
  productImageCover: z.array(z.any()).min(1, "Ảnh bìa là bắt buộc"),
  productImages: z.array(z.any()).min(1, "Cần ít nhất 1 ảnh sản phẩm"),
});

type FormData = z.infer<typeof formSchema>;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function ProductForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [productImageCover, setProductImageCover] = useState<UploadFile[]>([]);
  const [productImages, setProductImages] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const token = getAccessToken();
  const vendorId = token
    ? (GetDataByToken(token) as { vendorId: string }).vendorId
    : null;
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const [createProduct, { isLoading: isLoadingCreateProduct }] =
    useCreateProductMutation();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("vendorId", vendorId ?? "");
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description || "");
    formData.append("sku", data.sku);
    formData.append("sold", data.sold.toString());

    if (productImageCover[0]?.originFileObj) {
      formData.append(
        "productImageCover",
        productImageCover[0].originFileObj,
        productImageCover[0].name
      );
    }

    productImages.forEach((image) => {
      if (image.originFileObj) {
        formData.append("productImages", image.originFileObj, image.name);
      }
    });

    try {
      const response = await createProduct(formData);

      if (response.data?.isSuccess) {
        message.success("Sản phẩm đã được thêm thành công");
      } else {
        message.error("Không thể thêm sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Đã xảy ra lỗi khi thêm sản phẩm");
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCoverImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setProductImageCover(newFileList);
    setValue(
      "productImageCover",
      newFileList as [UploadFile<any>, ...UploadFile<any>[]]
    );
  };

  const handleProductImagesChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setProductImages(newFileList);
    setValue("productImages", newFileList);
  };

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
  }) => {
    setTimeout(() => {
      onSuccess && onSuccess("ok");
    }, 0);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );
  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="">Thêm Sản Phẩm Mới</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pb-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-12  gap-4"
        >
          {/* Left column: Category, Name, Price, SKU, Sold */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="productCategoryId">Danh Mục Sản Phẩm</Label>
              <Controller
                name="productCategoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.value?.items?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productCategoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productCategoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Tên Sản Phẩm</Label>
              <Input id="name" {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">Mã SKU</Label>
              <Input id="sku" {...register("sku")} className="mt-1" />
              {errors.sku && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sku.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sold">Đã Bán</Label>
              <Input
                id="sold"
                type="number"
                {...register("sold", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.sold && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sold.message}
                </p>
              )}
            </div>
          </div>

          {/* Middle column: Description (Rich Text Editor) */}
          <div className="col-span-12 md:col-span-8">
            <Label htmlFor="description">Mô Tả Sản Phẩm</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="mt-1">
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={modules}
                    formats={formats}
                    className="h-[340px] mb-12"
                  />
                </div>
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Right column: Cover Image, Product Images */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="productImageCover">Ảnh Bìa</Label>
              <Upload
                listType="picture-card"
                fileList={productImageCover}
                onPreview={handlePreview}
                onChange={handleCoverImageChange}
                customRequest={customRequest}
                maxCount={1}
                className="mt-1"
              >
                {productImageCover.length >= 1 ? null : uploadButton}
              </Upload>
              {errors.productImageCover && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productImageCover.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="productImages">Ảnh Sản Phẩm</Label>
              <Upload
                listType="picture-card"
                fileList={productImages}
                onPreview={handlePreview}
                onChange={handleProductImagesChange}
                customRequest={customRequest}
                multiple
                className="mt-1"
              >
                {productImages.length >= 8 ? null : uploadButton}
              </Upload>
              {errors.productImages && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productImages.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit button - full width */}
          <div className="col-span-12">
            <ColorfulButton
              icon={isLoadingCreateProduct ? Loader2 : CheckCircle2}
              label={
                isLoadingCreateProduct
                  ? "Đang thêm sản phẩm..."
                  : "Thêm sản phẩm"
              }
              disabled={isLoadingCreateProduct}
              className="w-full"
            />
          </div>
        </form>
      </CardContent>

      <Image
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => {
            setPreviewOpen(visible);
            if (!visible) {
              setPreviewImage("");
            }
          },
        }}
      />
    </Card>
  );
}

export default function Component() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isLoading } = useGetProductByIdQuery(productId);
  if (productId == "new") {
    return <ProductForm />;
  }
  if (product) {
    return <ProductDetails product={product?.value as IProductDetail} />;
  }
  return <div>Product not found</div>;
}
