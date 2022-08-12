import React, { FC } from "react";

import "./extra-list.styles.scss";
import { useCart } from "../../hooks/useCart";
import { productActions, useAppDispatch } from "../../redux";
import { DatabaseCartProduct, Product } from "../../common/types";
import { currency } from "../../common/constants";

interface extraItemProps {
   product: Product;
   updateCart: Function;
}

const ExtraItem: FC<extraItemProps> = ({ product, updateCart }) => {
   const cart = useCart();
   const dispatch = useAppDispatch();

   function addItemToCart() {
      const { price, id, translate, image_url } = product;
      const p: DatabaseCartProduct = {
         category: product.category,
         quantity: 1,
         translate,
         price,
         id,
         image_url
      };
      cart.addProduct(p);
      dispatch(productActions.setTotalCartPrice(cart.calculateCartTotalPrice()));
      updateCart(cart.getCart());
   }

   return (
      <div onClick={() => addItemToCart()} className="extra_item">
         <div className="item_top">
            <img className="item_image" src={product.image_url} alt="item" />
            <p className="item_name">{product.translate}</p>
         </div>
         <div className="item_bottom">
            <p className="item_other">{product.features.volume ? `${product.features.volume} мл.` : `${product.features.weight} г.`}</p>
            <p className="item_price">
               +{product.price} {currency}
            </p>
         </div>
      </div>
   );
};

export default ExtraItem;
