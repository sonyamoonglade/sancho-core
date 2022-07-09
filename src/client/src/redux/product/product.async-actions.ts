import { AppDispatch } from "../store";
import { productSlice } from "./product.slice";
import { AxiosInstance } from "axios";
import { Product } from "../../common/types";

const productActions = productSlice.actions;

export const getCatalog = (client: AxiosInstance) => async (dispatch: AppDispatch) => {
   try {
      const { data } = await client.get("/product/catalog");
      dispatch(productActions.setCatalog(data?.catalog));
      dispatch(productActions.setCategories(data?.categories));
   } catch (e: any) {
      dispatch(productActions.setErrorMessage(e.message));
   }
};
