"use client";

import React, { useEffect, useState } from "react";
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
import { message, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/services/apis";
import { getAccessToken, GetDataByToken } from "@/utils";
import ColorfulButton from "@/components/Auth/ColorfulButton";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import { IProductDetail } from "@/types";
import { RcFile } from "antd/es/upload";

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
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  price: z.number().positive("Giá phải là số dương"),
  description: z.string().optional(),
  sku: z
    .union([z.string(), z.number()])
    .transform((val) => val.toString())
    .optional(),
  sold: z.number().nonnegative("Số lượng đã bán không thể âm"),
  productImageCover: z.array(z.any()).min(1, "Ảnh bìa là bắt buộc").optional(),
  productImages: z
    .array(z.any())
    .min(1, "Cần ít nhất 1 ảnh sản phẩm")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ProductFormProps {
  product?: IProductDetail;
}

export default function ProductForm({ product }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategoryId: product?.productCategoryId || "",
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      sku: product?.sku || "",
      sold: product?.sold || 0,
      productImageCover: product?.coverImage
        ? [{ url: product.coverImage }]
        : [],
      productImages:
        product?.productImageList?.map((img) => ({ url: img.imageUrl })) || [],
    },
  });

  const [productImageCover, setProductImageCover] = useState<UploadFile[]>([]);
  const [productImages, setProductImages] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [updateProduct] = useUpdateProductMutation();
  const token = getAccessToken();
  const vendorId = token
    ? (GetDataByToken(token) as { vendorId: string }).vendorId
    : null;
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const [createProduct, { isLoading: isLoadingCreateProduct }] =
    useCreateProductMutation();

  useEffect(() => {
    // Nếu product tồn tại, set lại giá trị mặc định cho các field
    if (product) {
      setValue("productCategoryId", product.productCategoryId);
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
      setValue("sku", product.sku);
      setValue("sold", product.sold);

      // Cài đặt ảnh mặc định nếu có
      if (product.coverImage) {
        const coverFile: UploadFile[] = [
          {
            uid: "-1",
            name: "cover.png",
            status: "done",
            url: product.coverImage,
          },
        ];
        setProductImageCover(coverFile);
      }
    }
  }, [product, setValue]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("vendorId", vendorId ?? "");
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description || "");

    // Only append sku if it's provided or if it's a new product
    if (data.sku || !product) {
      formData.append("sku", data.sku || "");
    }

    formData.append("sold", data.sold.toString());

    // Handle cover image
    if (productImageCover[0]?.originFileObj) {
      formData.append(
        "productImageCover",
        productImageCover[0].originFileObj,
        productImageCover[0].name
      );
    } else if (product?.coverImage) {
      formData.append("productImageCover", product.coverImage);
    }

    // Handle product images
    if (productImages.length > 0) {
      productImages.forEach((image) => {
        if (image.originFileObj) {
          formData.append("productImages", image.originFileObj, image.name);
        }
      });
    }

    try {
      const isUpdate = !!product;

      if (isUpdate) {
        formData.append("id", product?.id || "");
      }

      const response = isUpdate
        ? await updateProduct({ id: product?.id || "", body: formData })
        : await createProduct(formData);

      const successMessage = isUpdate
        ? "Sản phẩm đã được cập nhật thành công"
        : "Sản phẩm đã được thêm thành công";

      if (response.data?.isSuccess) {
        message.success(successMessage);
      } else {
        message.error("Không thể cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Đã xảy ra lỗi khi cập nhật sản phẩm");
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
      <Plus className="w-4 h-4" />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="">
          {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pb-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-4"
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

          {/* Submit button */}
          <div className="col-span-12 mb-5">
            <ColorfulButton
              icon={isLoadingCreateProduct ? Loader2 : CheckCircle2}
              label={isLoadingCreateProduct ? "Đang lưu..." : "Lưu sản phẩm"}
              disabled={isLoadingCreateProduct}
              className="w-full"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
