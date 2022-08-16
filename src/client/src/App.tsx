import React, { useEffect, useRef } from "react";

import { useAxios } from "./hooks/useAxios";
import Layout from "./components/layout/layout/Layout";
import AppForm from "./components/appForm/AppForm";
import { CatalogContext } from "./components/layout/context";
import { fetchMiscData, getCatalog, productSelector, useAppDispatch, useAppSelector, userSelector, windowActions, windowSelector } from "./redux";
import CartLink from "./components/cart/cartLink/CartLink";
import OrderLink from "./components/createUserOrder/orderLink/OrderLink";
import ProductPresentation from "./components/product/productPresentation/ProductPresentation";
import Catalog from "./components/catalog/Catalog";
import { authMe } from "./redux/user/user-async.actions";
import { useMediaQuery } from "react-responsive";
import { AppResponsiveState } from "./types/types";
import { useNavigate } from "react-router-dom";
import Categories from "./components/categories/Categories";
import PayLink from "./components/ui/payLink/PayLink";
import { useCart } from "./hooks/useCart";

export const baseBackendUrl = "https://pizza-fullstack.herokuapp.com";
export const baseUrl = `https://storage.yandexcloud.net/zharpizza-bucket/static/images`;

function App() {
   const client = useAxios();
   const dispatch = useAppDispatch();
   const { productList, isCartEmpty } = useAppSelector(productSelector);
   const { cart, appResponsiveState, pay, userOrder } = useAppSelector(windowSelector);
   const { isWorkerAuthenticated, isAuthenticated, isMasterAuthenticated } = useAppSelector(userSelector);
   const router = useNavigate();
   const isNotMobileOrTablet = useMediaQuery({ minWidth: 1440 });
   const catalogRef = useRef<HTMLDivElement>(null);

   const localStorageCart = useCart();
   useEffect(() => {
      if (isNotMobileOrTablet && appResponsiveState !== AppResponsiveState.computer) {
         dispatch(windowActions.setResponsiveState(AppResponsiveState.computer));
      } else if (appResponsiveState !== AppResponsiveState.mobileOrTablet) {
         dispatch(windowActions.setResponsiveState(AppResponsiveState.mobileOrTablet));
      }
   }, [isNotMobileOrTablet]);

   useEffect(() => {
      dispatch(authMe(client));
      dispatch(getCatalog(client));
      dispatch(fetchMiscData(client));
   }, []);

   useEffect(() => {
      if (productList.length !== 0) {
         localStorageCart.renewDBCartProductImages(productList);
      }
   }, [productList]);

   useEffect(() => {
      if (isAuthenticated) {
         router("/", { replace: true });
      } else if (!isWorkerAuthenticated) {
         router("/", { replace: true });
      } else if (!isMasterAuthenticated) {
         router("/", { replace: true });
      }
   }, [isAuthenticated, isWorkerAuthenticated, isMasterAuthenticated]);

   return (
      <CatalogContext.Provider
         value={{
            catalogRef
         }}>
         <Layout>
            <Categories />
            {productList.length !== 0 && <Catalog productList={productList} />}
            {cart && <OrderLink />}
            {!isNotMobileOrTablet && !isCartEmpty && <CartLink />}
            {userOrder && <PayLink />}
            <AppForm />
            <ProductPresentation />
         </Layout>
      </CatalogContext.Provider>
   );
}

export default React.memo(App);
