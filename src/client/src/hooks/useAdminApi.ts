import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct, Category, RenderMasterUser, RenderRunnerUser } from "../types/types";
import { EditFormValues } from "../components/admin/productModal/edit/hooks/useEditProductModalForm";
import { CreateFormValues } from "../components/admin/productModal/create/hooks/useCreateProductModalForm";
import { AggregationPreset, MasterUser, ProductTopArray, RunnerUser } from "../common/types";
import { WorkerRegisterFormState } from "../components/admin/workerRegister/hooks/useWorkerRegisterForm";
import { RunnerRegisterFormState } from "../components/admin/runnerRegister/hooks/useRunnerRegisterForm";

interface AdminCatalogResponse {
   catalog: AdminProduct[];
}

interface AdminCategoriesResponse {
   categories: Category[];
}

interface ProductTopResponse {
   top: ProductTopArray;
}
interface RegisterMasterUserResponse {
   user: RenderMasterUser;
}
interface RegisterRunnerUserResponse {
   user: RenderRunnerUser;
}
interface MastersAndWorkersResponse {
   workers: MasterUser[];
   runners: RunnerUser[];
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
      async function (): Promise<Category[]> {
         const url = `/admin/category/`;
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

   const rankUp = useCallback(
      async function (name: string): Promise<Category[]> {
         const url = `/admin/category/rankup?name=${name}`;
         const res = await client.put<AdminCategoriesResponse>(url);
         return res.data.categories;
      },
      [client]
   );
   const rankDown = useCallback(
      async function (name: string): Promise<Category[]> {
         const url = `/admin/category/rankdown?name=${name}`;
         const res = await client.put<AdminCategoriesResponse>(url);
         return res.data.categories;
      },
      [client]
   );

   const createCategory = useCallback(
      async function (name: string): Promise<Category[]> {
         const url = `/admin/category/`;
         const res = await client.post<AdminCategoriesResponse>(url, { name });
         return res.data.categories;
      },
      [client]
   );

   const deleteCategory = useCallback(
      async function (name: string): Promise<Category[]> {
         const url = `/admin/category/${name}`;
         const res = await client.delete<AdminCategoriesResponse>(url);
         return res.data.categories;
      },
      [client]
   );

   const registerWorker = useCallback(
      async function (body: WorkerRegisterFormState): Promise<RenderMasterUser> {
         const url = `/users/admin/registerWorker`;
         const res = await client.post<RegisterMasterUserResponse>(url, body);
         return res.data.user;
      },
      [client]
   );

   const registerRunner = useCallback(
      async function (body: RunnerRegisterFormState): Promise<RenderRunnerUser> {
         const url = `/delivery/admin/runner`;
         const res = await client.post<RegisterRunnerUserResponse>(url, body);
         return res.data.user;
      },
      [client]
   );

   const fetchMastersAndRunners = useCallback(
      async function (): Promise<MastersAndWorkersResponse> {
         const url = `/users/admin/`;
         const res = await client.get<MastersAndWorkersResponse>(url);
         return res.data;
      },
      [client]
   );

   return {
      fetchAdminCatalog,
      approveProduct,
      uploadImage,
      updateProduct,
      getAvailableCategories,
      createProduct,
      deleteProduct,
      getProductTop,
      rankUp,
      rankDown,
      deleteCategory,
      createCategory,
      registerWorker,
      registerRunner,
      fetchMastersAndRunners
   };
}
