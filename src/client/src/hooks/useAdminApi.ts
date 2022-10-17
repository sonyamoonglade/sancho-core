import { useAxios } from "./useAxios";
import { useCallback } from "react";
import { AdminProduct, Category, RenderMasterUser, SubscriberRO, SubscriberWithoutSubscriptionsRO } from "../types/types";
import { EditFormValues } from "../components/admin/productModal/edit/hooks/useEditProductModalForm";
import { CreateFormValues } from "../components/admin/productModal/create/hooks/useCreateProductModalForm";
import { AggregationPreset, ExternalEvent, MasterUser, ProductTopArray, RunnerUser } from "../common/types";
import { WorkerRegisterFormState } from "../components/admin/workerRegister/hooks/useWorkerRegisterForm";
import { RunnerRegisterFormValues } from "../components/admin/runnerRegister/hooks/useRunnerRegisterForm";
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

   const uploadImage = useCallback(
      async function (file: File, productId: number): Promise<boolean> {
         const formData = new FormData();
         //Name of formData field
         const name = "payload";
         formData.append(name, file);
         //Set productId that we upload image for
         const res = await client.post(`/product/admin/upload?v=${productId}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         return res.status === 201;
      },
      [client]
   );

   const fetchAdminCatalog = useCallback(async function (): Promise<AdminProduct[]> {
      const { data } = await client.get<AdminCatalogResponse>("/product/admin/catalog");
      return data.catalog;
   }, []);

   const approveProduct = useCallback(async function (productId: number): Promise<boolean> {
      const res = await client.put(`/product/admin/approve?v=${productId}`);
      return res.status === 200;
   }, []);

   const updateProduct = useCallback(
      async function (body: EditFormValues, productId: number): Promise<boolean> {
         const res = await client.put(`/product/admin/update?id=${productId}`, body);
         return res.status === 200;
      },
      [client]
   );

   const getAvailableCategories = useCallback(
      async function (): Promise<Category[]> {
         const { data } = await client.get<AdminCategoriesResponse>("/admin/category/");
         return data.categories;
      },
      [client]
   );

   const createProduct = useCallback(
      async function (body: CreateFormValues): Promise<boolean> {
         const res = await client.post("/product/admin/create", body);
         return res.status === 201;
      },
      [client]
   );

   const deleteProduct = useCallback(
      async function (productId: number): Promise<boolean> {
         const res = await client.delete(`/product/admin/delete?id=${productId}`);
         return res.status === 200;
      },
      [client]
   );

   const getProductTop = useCallback(
      async function (aggregation: AggregationPreset): Promise<ProductTopArray> {
         const res = await client.get<ProductTopResponse>(`/admin/statistics/product/top?aggregation=${aggregation}`);
         return res.data.top;
      },
      [client]
   );

   const rankUp = useCallback(
      async function (name: string): Promise<Category[]> {
         const res = await client.put<AdminCategoriesResponse>(`/admin/category/rankup?name=${name}`);
         return res.data.categories;
      },
      [client]
   );
   const rankDown = useCallback(
      async function (name: string): Promise<Category[]> {
         const res = await client.put<AdminCategoriesResponse>(`/admin/category/rankdown?name=${name}`);
         return res.data.categories;
      },
      [client]
   );

   const createCategory = useCallback(
      async function (name: string): Promise<Category[]> {
         const res = await client.post<AdminCategoriesResponse>("/admin/category/", { name });
         return res.data.categories;
      },
      [client]
   );

   const deleteCategory = useCallback(
      async function (name: string): Promise<Category[]> {
         const res = await client.delete<AdminCategoriesResponse>(`/admin/category/${name}`);
         return res.data.categories;
      },
      [client]
   );

   const registerWorker = useCallback(
      async function (body: WorkerRegisterFormState): Promise<void> {
         await client.post("/users/admin/registerWorker", body);
      },
      [client]
   );

   const registerRunner = useCallback(
      async function (body: RunnerRegisterFormValues): Promise<void> {
         await client.post("/delivery/admin/runner", body);
      },
      [client]
   );

   const fetchMastersAndRunners = useCallback(
      async function (): Promise<MastersAndWorkersResponse> {
         const res = await client.get<MastersAndWorkersResponse>("/users/admin/");
         return res.data;
      },
      [client]
   );

   const fetchSubscriberJoinedData = useCallback(
      async function (): Promise<SubscriberRO[]> {
         const { data } = await client.get("/admin/event/subscriptions/joined");
         return data.subscribers;
      },
      [client]
   );

   const fetchAllSubscribers = useCallback(
      async function (): Promise<SubscriberWithoutSubscriptionsRO[]> {
         const { data } = await client.get("/admin/event/subscriptions/subscribers");
         return data.subscribers;
      },
      [client]
   );

   const fetchAvailableEvents = useCallback(
      async function (): Promise<ExternalEvent[]> {
         const { data } = await client.get("/admin/event");
         return data.events;
      },
      [client]
   );

   const subscribe = useCallback(
      async function (body: SubscribeDto): Promise<void> {
         await client.post("/admin/event/subscriptions", body);
         return;
      },
      [client]
   );

   const unsubscribe = useCallback(
      async function (subscriptionId: number): Promise<void> {
         await client.delete(`/admin/event/subscriptions/${subscriptionId}`);
         return;
      },
      [client]
   );

   const registerSubscriber = useCallback(
      async function (phone_number: string): Promise<boolean> {
         const res = await client.post("/admin/event/subscriptions/subscribers", {
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
