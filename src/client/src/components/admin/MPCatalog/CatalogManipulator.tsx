import React, { useEffect, useState } from "react";
import "./adm-catalog.styles.scss";
import { AdminProduct } from "../../../common/types";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { IoIosAddCircleOutline } from "react-icons/io";
import MPItem from "../MPItem/MPItem";

const CatalogManipulator = () => {
   const [products, setProducts] = useState<AdminProduct[]>([]);
   const { fetchAdminCatalog } = useAdminApi();

   useEffect(() => {
      fetchAdminCatalog().then((products) => setProducts(products));
   }, []);

   //Indication of local approval without fetching catalog (run only if receive 200 OK)
   function locallyApproveProduct(productId: number) {
      setProducts((products) => {
         return products.map((p) => {
            if (p.id === productId) {
               p.approved = !p.approved;
               return p;
            }
            return p;
         });
      });
   }

   return (
      <ul className="manipulator">
         <li className="mp_card">
            <div className="mp_add">
               <p className="mp_title">Добавить новую позицию</p>
               <IoIosAddCircleOutline size={35} />
            </div>
         </li>
         {products?.map((p) => (
            <MPItem product={p} key={p.id} locallyApprove={locallyApproveProduct} />
         ))}
      </ul>
   );
};

export default CatalogManipulator;
