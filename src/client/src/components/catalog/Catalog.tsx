import React, { FC, useContext } from "react";

import "./catalog.styles.scss";
import ProductCard from "../product/productCard/ProductCard";
import { Product } from "../../common/types";
import { CatalogContext } from "../layout/context";

interface catalogProps {
   productList: Product[];
}

const Catalog: FC<catalogProps> = ({ productList }) => {
   function attachCategoryId(p: Product, i: number): string {
      if (i === 0) {
         return p.category;
      }

      const categCount = productList.reduce((a: number, c: Product, i: number) => {
         const currCateg = c.category;
         let nextCateg: string;
         if (i !== productList.length - 1) {
            nextCateg = productList[i + 1]?.category;
         }
         if (currCateg !== nextCateg) {
            a += 1;
         }
         return a;
      }, 0);

      if (productList[i].category !== productList[i - 1].category) {
         return productList[i].category;
      }

      return "";
   }

   const { catalogRef } = useContext(CatalogContext);

   return (
      <div ref={catalogRef} className="catalog">
         {productList.map((p, i) => {
            const category = attachCategoryId(p, i);

            if (category) {
               return <ProductCard id={category} product={p} key={p.id} />;
            }
            return <ProductCard product={p} key={p.id} />;
         })}
      </div>
   );
};

export default Catalog;
