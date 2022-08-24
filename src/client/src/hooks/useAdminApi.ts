import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct, Category, RenderMasterUser, SubscriberRO, SubscriberWithoutSubscriptionsRO } from "../types/types";
import { EditFormValues } from "../components/admin/productModal/edit/hooks/useEditProductModalForm";
import { CreateFormValues } from "../components/admin/productModal/create/hooks/useCreateProductModalForm";
import { AggregationPreset, ExternalEvent, MasterUser, ProductTopArray, RunnerUser } from "../common/types";
import { WorkerRegisterFormState } from "../components/admin/workerRegister/hooks/useWorkerRegisterForm";
import {
   RunnerRegisterFormState,
   RunnerRegisterFormValues
} from "../components/admin/runnerRegister/hooks/useRunnerRegisterForm";
import { SubscribeDto } from "../components/admin/subcriptionsTable/SubscriptionsTable";

interface AdminCatalogResponse {
   catalog: AdminProduct[];
}

interface AdminCategoriesResponse {
   categories: Category[];
}

interface ProductTopResponse {
   top: ProductTopArray;
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
      async function (body: WorkerRegisterFormState): Promise<void> {
         const url = `/users/admin/registerWorker`;
         await client.post(url, body);
      },
      [client]
   );

   const registerRunner = useCallback(
      async function (body: RunnerRegisterFormValues): Promise<void> {
         const url = `/delivery/admin/runner`;
         await client.post(url, body);
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

   const fetchSubscriberJoinedData = useCallback(
      async function (): Promise<SubscriberRO[]> {
         const url = "/admin/event/subscriptions/joined";
         const { data } = await client.get(url);
         return data.subscribers;
      },
      [client]
   );

   const fetchAllSubscribers = useCallback(
      async function (): Promise<SubscriberWithoutSubscriptionsRO[]> {
         const url = "/admin/event/subscriptions/subscribers";
         const { data } = await client.get(url);
         return data.subscribers;
      },
      [client]
   );

   const fetchAvailableEvents = useCallback(
      async function (): Promise<ExternalEvent[]> {
         const url = "/admin/event";
         const { data } = await client.get(url);
         return data.events;
      },
      [client]
   );

   const subscribe = useCallback(
      async function (body: SubscribeDto): Promise<void> {
         const url = "/admin/event/subscriptions";
         await client.post(url, body);
         return;
      },
      [client]
   );

   const unsubscribe = useCallback(
      async function (subscriptionId: number): Promise<void> {
         const url = `/admin/event/subscriptions/${subscriptionId}`;
         await client.delete(url);
         return;
      },
      [client]
   );

   const registerSubscriber = useCallback(
      async function (phone_number: string): Promise<boolean> {
         const url = "/admin/event/subscriptions/subscribers";
         const res = await client.post(url, {
            phone_number
         });
         return res.status === 201;
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
      fetchMastersAndRunners,
      fetchSubscriberJoinedData,
      fetchAvailableEvents,
      subscribe,
      fetchAllSubscribers,
      unsubscribe,
      registerSubscriber
   };
}
