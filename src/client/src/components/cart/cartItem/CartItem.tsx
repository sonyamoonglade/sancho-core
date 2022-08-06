import React, { FC } from "react";

import "./cart-item.styles.scss";
import { DatabaseCartProduct } from "../../../common/types";
import { currency } from "../../../common/constants";
import { useCart } from "../../../hooks/useCart";
import { productActions, useAppDispatch } from "../../../redux";
import ReduceAddButton from "../../worker/virtualCart/ReduceAddButton";

interface cartItemProps {
   product: DatabaseCartProduct;
}

const CartItem: FC<cartItemProps> = ({ product }) => {
   const cart = useCart();
   const dispatch = useAppDispatch();

   function reduceProductQuantity(id: number) {
      cart.removeProduct(id);
      const newCartPrice = cart.calculateCartTotalPrice();
      dispatch(productActions.setTotalCartPrice(newCartPrice));
      if (newCartPrice === 0) {
         dispatch(productActions.setCartEmpty(true));
      }
   }
   function addProductQuantity(id: number) {
      cart.addProduct(product);
      const newCartPrice = cart.calculateCartTotalPrice();
      dispatch(productActions.setTotalCartPrice(newCartPrice));
   }

   return (
      <li className="cart_item">
         <div className="leading">
            <img className="cart_item_image" src={product.image_url} alt="" />
            <div className="info">
               <p className="cart_item_translate">{product.translate}</p>
               <p className="cart_item_price">
                  {product.price} {currency}
               </p>
            </div>
         </div>

         <div className="price_info">
            <div className="cart_item_quantity">
               <ReduceAddButton add={addProductQuantity} dbProduct={product} reduce={reduceProductQuantity} />
            </div>
            <i className="quantity_price">
               {product.quantity * product.price} {currency}
            </i>
         </div>
      </li>
   );
};

export default React.memo(CartItem);
