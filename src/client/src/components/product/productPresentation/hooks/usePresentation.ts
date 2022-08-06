import { useEffect, useMemo, useState } from "react";
import { DatabaseCartProduct, Product } from "../../../../common/types";
import { useCart } from "../../../../hooks/useCart";
import { productActions, useAppDispatch } from "../../../../redux";

export function usePresentation(isPresentingNow: boolean, presentedProduct: Product) {
   const cart = useCart();
   const dispatch = useAppDispatch();

   const [isProductInCart, setIsProductInCart] = useState<DatabaseCartProduct>(null);
   const [isLongName, setIsLongName] = useState<boolean>(false);
   const [longName, setLongName] = useState<string>("");

   const startingQuantity = useMemo(() => {
      if (presentedProduct) {
         const cartP = cart.getById(presentedProduct.id);
         if (!cartP) return 0;
         return cartP.quantity;
      }
      return 0;
   }, [isPresentingNow]);

   const isEmptyCart = useMemo(() => {
      const c = cart.getCart();
      const onCondition = !(c.length > 0);
      return onCondition;
   }, [isProductInCart]);

   useEffect(() => {
      dispatch(productActions.setCartEmpty(isEmptyCart));
   }, [isEmptyCart]);
   useEffect(() => {
      const body = document.querySelector("body");
      dispatch(productActions.setTotalCartPrice(cart.calculateCartTotalPrice()));
      if (isPresentingNow) {
         body!.style.overflow = "hidden";
      }
      return () => {
         body!.style.overflow = "visible";
      };
   }, [isPresentingNow]);

   function splitLongName() {
      const { translate } = presentedProduct;
      const len = translate.split(" ").length;
      if (len === 1) {
         setIsLongName(false);
         return;
      }
      const secondWord = translate.split(" ").pop();
      setIsLongName(true);
      setLongName(secondWord);
   }
   function addToCart(product: Product) {
      if (isProductInCart) return;
      const cartProduct: DatabaseCartProduct = {
         category: product.category,
         id: product.id,
         quantity: 1,
         translate: product.translate,
         price: product.price,
         image_url: product.image_url
      };
      cart.addProduct(cartProduct);
      const totalCartPrice = cart.calculateCartTotalPrice();
      dispatch(productActions.setTotalCartPrice(totalCartPrice));
   }
   function checkIsInCart(id: number) {
      const product = cart.getById(id);
      if (!product) return setIsProductInCart(null);
      dispatch(productActions.setPresentedProductQuantity(product.quantity));
      return setIsProductInCart(product);
   }

   return {
      splitLongName,
      addToCart,
      checkIsInCart,

      startingQuantity,
      isLongName,
      longName,
      isProductInCart
   };
}
