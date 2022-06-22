import { DatabaseCartProduct, Product } from "../../../common/types";

export interface VirtualCartInterface {
   clearVirtualCart(): void;
   addProduct(p: Product | DatabaseCartProduct): void;
   removeProduct(id: number): void;
   calculateCartTotalPrice(): number;
   getCurrentCart(): DatabaseCartProduct[];
   setVirtualCart(cart: DatabaseCartProduct[]): void;
   getTotalProductPrice(id: number): number;
}

export function useVirtualCart(): VirtualCartInterface {
   const KEY = "virtual_cart";

   function setVirtualCart(cart: DatabaseCartProduct[]): void {
      localStorage.setItem(KEY, JSON.stringify(cart));
   }

   function clearVirtualCart(): void {
      localStorage.setItem(KEY, JSON.stringify([]));
   }

   function addProduct(p: Product | DatabaseCartProduct): void {
      const actualCart = getCurrentCart();

      const sameIndex = actualCart.findIndex((prod) => prod.id === p.id);

      let newCart: DatabaseCartProduct[];

      if (sameIndex !== -1) {
         actualCart[sameIndex].quantity += 1;
         newCart = actualCart;
         setVirtualCart(newCart);
         return;
      }

      const dbP: DatabaseCartProduct = {
         id: p.id,
         price: p.price,
         translate: p.translate,
         category: p.category,
         quantity: 1
      };
      newCart = actualCart.concat(dbP);

      setVirtualCart(newCart);
      return;
   }

   function removeProduct(id: number): void {
      const actualCart = getCurrentCart();
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
      setVirtualCart(newCart);
   }

   function getCurrentCart(): DatabaseCartProduct[] {
      const result = localStorage.getItem(KEY);

      return result === null ? [] : JSON.parse(result);
   }

   function calculateCartTotalPrice(): number {
      const actualCart = getCurrentCart();
      let totalPrice = actualCart.reduce((a, c) => {
         a += c.price * c.quantity;
         return a;
      }, 0);
      return totalPrice;
   }

   function getTotalProductPrice(id: number): number {
      const actualCart = getCurrentCart();
      const p: DatabaseCartProduct = actualCart.find((prod) => prod.id === id);
      return p !== undefined ? p.price * p.quantity : 0;
   }

   return {
      clearVirtualCart,
      addProduct,
      removeProduct,
      calculateCartTotalPrice,
      getCurrentCart,
      setVirtualCart,
      getTotalProductPrice
   };
}
