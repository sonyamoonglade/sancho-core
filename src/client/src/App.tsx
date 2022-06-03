import React, {useEffect} from 'react';

import {useAxios} from "./hooks/useAxios";
import Layout from "./components/layout/layout/Layout";
import AppForm from "./components/appForm/AppForm";

import {getCatalogProducts, productSelector, useAppDispatch, useAppSelector, windowSelector} from "./redux";
import CartLink from "./components/cart/cartLink/CartLink";
import OrderLink from "./components/order/orderLink/OrderLink";
import ProductPresentation from "./components/product/productPresentation/ProductPresentation";
import Catalog from "./components/catalog/Catalog";
import {authMe} from "./redux/user/user-async.actions";


export const baseBackendUrl = "https://pizza-fullstack.herokuapp.com"


function App() {

  const {client} = useAxios()
  const dispatch = useAppDispatch()
  const {productList,isCartEmpty} = useAppSelector(productSelector)
  const {cart} = useAppSelector(windowSelector)
  useEffect(() => {
    dispatch(authMe(client))
    dispatch(getCatalogProducts(client))
  },[])

  return (
    <Layout >

      {
        productList.length !== 0 &&
        <Catalog productList={productList} />
      }
      {cart && <OrderLink />}
      {!isCartEmpty && <CartLink />}
      <AppForm />
      <ProductPresentation />

    </Layout>
  );
}

export default React.memo(App);
