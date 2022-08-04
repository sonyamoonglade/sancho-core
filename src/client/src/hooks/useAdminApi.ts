import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct, Categories, Product } from "../common/types";

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

   return { fetchAdminCatalog, approveProduct };
}
