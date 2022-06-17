import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../common/types";

interface ProductState {
    productList: Product[]
    isProductListLoading: boolean
    onLoadErrorMessage: string | null
    presentedProduct: Product | null
    presentedProductCartQuantity: number
    totalCartPrice: number
    isPresentingNow: boolean
    isCartEmpty: boolean
}

const initialState:ProductState = {
    productList: [],
    onLoadErrorMessage: null,
    presentedProduct: null,
    isProductListLoading: false,
    isPresentingNow: false,
    presentedProductCartQuantity: 0,
    totalCartPrice: 0,
    isCartEmpty: true
}


export const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{

        listLoading:(s) => {
            s.isProductListLoading = true
        },
        saveList:(s,a:PayloadAction<Product[]>) => {
            s.productList = a.payload
            s.isProductListLoading = false
        },
        setErrorMessage:(s,a:PayloadAction<string>) => {
            s.onLoadErrorMessage = a.payload
        },
        startPresentation:(s,a:PayloadAction<Product>) => {
            s.isPresentingNow = true
            s.presentedProduct = a.payload
        },
        stopPresentation:(s) => {
            s.isPresentingNow = false
            s.presentedProductCartQuantity = 0
        },
        setPresentedProductQuantity: (s, a:PayloadAction<number>) => {
            s.presentedProductCartQuantity = a.payload
        },
        setTotalCartPrice: (s,a:PayloadAction<number>) => {
            if(a.payload > 0){
                s.isCartEmpty = false
            }
            s.totalCartPrice = a.payload
        },
        setCartEmpty: (s,a:PayloadAction<boolean>) => {
            s.isCartEmpty = a.payload
        },



    }
})
export const productActions = productSlice.actions
export default productSlice.reducer
