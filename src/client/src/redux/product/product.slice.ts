import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../common/types";

interface ProductState {
   productList: Product[];
   isProductListLoading: boolean;
   onLoadErrorMessage: string | null;
   presentedProduct: Product | null;
   presentedProductCartQuantity: number;
   totalCartPrice: number;
   isPresentingNow: boolean;
   isCartEmpty: boolean;
   categories: {
      value: string;
      active: boolean;
   }[];
   categoriesScrollAdj: any;
}

const initialState: ProductState = {
   productList: [],
   categoriesScrollAdj: null,
   categories: [],
   onLoadErrorMessage: null,
   presentedProduct: null,
   isProductListLoading: false,
   isPresentingNow: false,
   presentedProductCartQuantity: 0,
   totalCartPrice: 0,
   isCartEmpty: true
};

export const productSlice = createSlice({
   name: "product",
   initialState,
   reducers: {
      setCategoriesAdj: function (s, a: PayloadAction<string>) {
         if (s.categoriesScrollAdj == null) {
            const mapLikeObj = JSON.parse(a.payload);
            s.categoriesScrollAdj = mapLikeObj;
         }
      },
      activateCategory: function (s, a: PayloadAction<string>) {
         s.categories = s.categories
            .map((c) => {
               return { ...c, active: false };
            })
            .map((c) => {
               if (c.value === a.payload) {
                  return {
                     ...c,
                     active: true
                  };
               }
               return c;
            });
      },
      setCategories: function (s, a: PayloadAction<string[]>) {
         s.categories = a.payload.map((categ, i) => {
            return {
               value: categ,
               active: i === 0
            };
         });
      },
      listLoading: (s) => {
         s.isProductListLoading = true;
      },
      setCatalog: (s, a: PayloadAction<Product[]>) => {
         s.productList = a.payload;
         s.isProductListLoading = false;
      },
      setErrorMessage: (s, a: PayloadAction<string>) => {
         s.onLoadErrorMessage = a.payload;
      },
      startPresentation: (s, a: PayloadAction<Product>) => {
         s.isPresentingNow = true;
         s.presentedProduct = a.payload;
      },
      stopPresentation: (s) => {
         s.isPresentingNow = false;
         s.presentedProductCartQuantity = 0;
      },
      setPresentedProductQuantity: (s, a: PayloadAction<number>) => {
         s.presentedProductCartQuantity = a.payload;
      },
      setTotalCartPrice: (s, a: PayloadAction<number>) => {
         if (a.payload > 0) {
            s.isCartEmpty = false;
         }
         s.totalCartPrice = a.payload;
      },
      setCartEmpty: (s, a: PayloadAction<boolean>) => {
         s.isCartEmpty = a.payload;
      }
   }
});
export const productActions = productSlice.actions;
export default productSlice.reducer;
