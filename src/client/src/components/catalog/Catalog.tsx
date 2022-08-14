import React, { FC, useContext } from "react";

import "./catalog.styles.scss";
import ProductCard from "../product/productCard/ProductCard";
import { Product } from "../../common/types";
import { CatalogContext } from "../layout/context";

interface catalogProps {
   productList: Product[];
}

const Catalog: FC<catalogProps> = ({ productList }) => {
   //Attach #id DOM prop
   function attachCategoryIdTag(p: Product, i: number): string {
      if (i === 0) {
         return p.category;
      }

      if (productList[i].category !== productList[i - 1].category) {
         return productList[i].category;
      }

      return "";
   }

   const { catalogRef } = useContext(CatalogContext);

   return (
      <div ref={catalogRef} className="catalog">
         {productList.map((p, i) => {
            const category = attachCategoryIdTag(p, i);

            if (category) {
               return <ProductCard id={category} product={p} key={p.id} />;
            }
            return <ProductCard product={p} key={p.id} />;
         })}
      </div>
   );
};

export default Catalog;
