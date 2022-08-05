import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct } from "../types/types";
import { Categories } from "../common/types";

interface AdminCatalogResponse {
   categories: Categories;
   catalog: AdminProduct[];
}

export function useAdminApi() {
   const client = useAxios();

   const fetchAdminCatalog = useCallback(async function (): Promise<AdminProduct[]> {
      const { data } = await client.get<AdminCatalogResponse>("/product/admin/catalog");
      return data.catalog;
   }, []);

   const approveProduct = useCallback(async function (productId: number): Promise<boolean> {
      const res = await client.put(`/product/admin/approve?v=${productId}`);
      return res.status === 200;
   }, []);

   const uploadImage = useCallback(async function (file: File, productId: number): Promise<boolean> {
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
   }, []);

   return { fetchAdminCatalog, approveProduct, uploadImage };
}
