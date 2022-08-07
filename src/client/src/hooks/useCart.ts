import { CartInterface } from "../types/types";
import { DatabaseCartProduct, Product } from "../common/types";

const CART_KEY = "cart";

export function useCart() {
   function toJSON(i: any) {
      return JSON.stringify(i);
   }
   function parseJSON(i: any) {
      return JSON.parse(i);
   }

   const addProduct = (product: DatabaseCartProduct) => {
      const actualCart = getCart();
      const sameProductIdx = actualCart.findIndex((p) => p.id === product.id);
      let newCart;
      if (sameProductIdx === -1) {
         newCart = actualCart.concat(product);
      } else {
         newCart = actualCart.map((p) => {
            if (p.id === product.id) {
               p.quantity += 1;
               return p;
            }
            return p;
         });
      }
      updateCart(newCart);
      return;
   };

   const removeProduct = (id: number) => {
      const actualCart = getCart();
      const p = actualCart.find((p) => p.id === id);
      let newCart;
      if (p.quantity === 1) {
         newCart = actualCart.filter((p) => p.id !== id);
      } else {
         newCart = actualCart.map((p) => {
            if (p.id === id) {
               p.quantity -= 1;
               return p;
            }
            return p;
         });
      }
      updateCart(newCart);
   };

   const getCart = () => {
      const cart: DatabaseCartProduct[] = parseJSON(localStorage.getItem(CART_KEY));
      function sortFunc(a: DatabaseCartProduct, b: DatabaseCartProduct) {
         return b.price - a.price;
      }
      return cart !== null ? cart.sort(sortFunc) : [];
   };

   const updateCart = (newCart: DatabaseCartProduct[]) => {
      localStorage.setItem(CART_KEY, toJSON(newCart));
      return;
   };

   const clearCart = () => {
      localStorage.removeItem(CART_KEY);
   };

   const calculateCartTotalPrice = () => {
      const actualCart = getCart();
      let totalPrice = actualCart.reduce((a, c) => {
         a += c.price * c.quantity;
         return a;
      }, 0);

      return totalPrice;
   };

   const getById = (id: number) => {
      const actualCart = getCart();
      return actualCart.find((p) => p.id === id);
   };

   //After update of product image (image url's stored in local storage are no longer valid. Need to renew it
   const renewDBCartProductImages = (products: Product[]) => {
      const cart = getCart();
      const updated = [];
      for (const product of products) {
         for (const item of cart) {
            if (item.id === product.id) {
               //Change the image url
               const newItem: DatabaseCartProduct = { ...item, image_url: product.image_url };
               updated.push(newItem);
            }
         }
      }
      updateCart(updated);
      return;
   };

   const cart: CartInterface = {
      addProduct,
      removeProduct,
      getCart,
      clearCart,
      calculateCartTotalPrice,
      getById,
      renewDBCartProductImages
   };

   return cart;
}
