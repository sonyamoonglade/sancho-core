import React, {useEffect} from 'react';

import {useAxios} from "./hooks/useAxios";
import Layout from "./components/layout/layout/Layout";
import AppForm from "./components/appForm/AppForm";

import {
    fetchMiscData,
    getCatalogProducts,
    productSelector,
    useAppDispatch,
    useAppSelector,
    userSelector,
    windowActions,
    windowSelector
} from "./redux";
import CartLink from "./components/cart/cartLink/CartLink";
import OrderLink from "./components/createUserOrder/orderLink/OrderLink";
import ProductPresentation from "./components/product/productPresentation/ProductPresentation";
import Catalog from "./components/catalog/Catalog";
import {authMe} from "./redux/user/user-async.actions";
import {useMediaQuery} from "react-responsive";
import {AppResponsiveState} from "./types/types";
import {useNavigate} from "react-router-dom";


export const baseBackendUrl = "https://pizza-fullstack.herokuapp.com"


function App() {

    const {client} = useAxios()
    const dispatch = useAppDispatch()
    const {productList,isCartEmpty} = useAppSelector(productSelector)
    const {cart,appResponsiveState} = useAppSelector(windowSelector)
    const {isMasterAuthenticated,isAuthenticated} = useAppSelector(userSelector)
    const router = useNavigate()
    const isNotMobileOrTablet = useMediaQuery({minWidth: 1440})

    useEffect(() => {

      if(isNotMobileOrTablet && appResponsiveState !== AppResponsiveState.computer){
        dispatch(windowActions.setResponsiveState(AppResponsiveState.computer))
      }
      else if(appResponsiveState !== AppResponsiveState.mobileOrTablet) {
        dispatch(windowActions.setResponsiveState(AppResponsiveState.mobileOrTablet))
      }

    },[isNotMobileOrTablet])


    useEffect(() => {
        dispatch(authMe(client))
        dispatch(getCatalogProducts(client))
        dispatch(fetchMiscData(client))
    },[])

    useEffect(() => {
        if(isAuthenticated){
            router("/",{replace: true})
        }else if(!isMasterAuthenticated){
            router("/", {replace: true})
        }
    },[isAuthenticated,isMasterAuthenticated])



    return (
        <Layout >

              {
                productList.length !== 0 &&
                <Catalog productList={productList} />
              }
              {!isNotMobileOrTablet ? (cart && <OrderLink /> ): null}
              {!isNotMobileOrTablet ? (!isCartEmpty && <CartLink />) : null}
              <AppForm />
              <ProductPresentation />

        </Layout>
    );
}

export default React.memo(App);
