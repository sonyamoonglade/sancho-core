import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct } from "../types/types";
import { EditFormValues } from "../components/admin/productModal/edit/hooks/useEditProductModalForm";
import { CreateFormValues } from "../components/admin/productModal/create/hooks/useCreateProductModalForm";
import { AggregationPreset, ProductTopArray } from "../common/types";

interface AdminCatalogResponse {
   catalog: AdminProduct[];
}

interface AdminCategoriesResponse {
   categories: string[];
}

interface ProductTopResponse {
   top: ProductTopArray;
}

export function useAdminApi() {
   const client = useAxios();

   const fetchAdminCatalog = useCallback(
      async function (): Promise<AdminProduct[]> {
         const { data } = await client.get<AdminCatalogResponse>("/product/admin/catalog");
         return data.catalog;
      },
      [client]
   );

   const approveProduct = useCallback(
      async function (productId: number): Promise<boolean> {
         const res = await client.put(`/product/admin/approve?v=${productId}`);
         return res.status === 200;
      },
      [client]
   );

   const uploadImage = useCallback(
      async function (file: File, productId: number): Promise<boolean> {
         const formData = new FormData();
         //Name of formData field
         const name = "payload";
         formData.append(name, file);
         //Set productId that we upload image for
         const url = `/product/admin/upload?v=${productId}`;
         const res = await client.post(url, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         return res.status === 201;
      },
      [client]
   );

   const updateProduct = useCallback(
      async function (body: EditFormValues, productId: number): Promise<boolean> {
         const url = `/product/admin/update?id=${productId}`;
         const res = await client.put(url, body);
         return res.status === 200;
      },
      [client]
   );

   const getAvailableCategories = useCallback(
      async function (): Promise<string[]> {
         const url = `/product/admin/categories`;
         const { data } = await client.get<AdminCategoriesResponse>(url);
         return data.categories;
      },
      [client]
   );

   const createProduct = useCallback(
      async function (body: CreateFormValues): Promise<boolean> {
         const url = "/product/admin/create";
         const res = await client.post(url, body);
         return res.status === 201;
      },
      [client]
   );

   const deleteProduct = useCallback(
      async function (productId: number): Promise<boolean> {
         const url = `/product/admin/delete?id=${productId}`;
         const res = await client.delete(url);
         return res.status === 200;
      },
      [client]
   );

   const getProductTop = useCallback(
      async function (aggregation: AggregationPreset): Promise<ProductTopArray> {
         const url = `/admin/statistics/product/top?aggregation=${aggregation}`;
         const res = await client.get<ProductTopResponse>(url);
         return res.data.top;
      },
      [client]
   );

   return { fetchAdminCatalog, approveProduct, uploadImage, updateProduct, getAvailableCategories, createProduct, deleteProduct, getProductTop };
}
