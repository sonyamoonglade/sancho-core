import React, { useEffect, useState } from "react";
import "./adm-catalog.styles.scss";
import { AdminProduct, Product } from "../../../common/types";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { baseUrl } from "../../../App";
import { currency } from "../../../common/constants";
import { IoIosAddCircleOutline } from "react-icons/io";
import { adminActions, useAppDispatch, windowActions } from "../../../redux";

const CatalogManipulator = () => {
   const [products, setProducts] = useState<AdminProduct[]>([]);
   const { fetchAdminCatalog, approveProduct } = useAdminApi();
   const dispatch = useAppDispatch();

   useEffect(() => {
      fetchAdminCatalog().then((products) => setProducts(products));
   }, []);

   async function handleApprove(productId: number) {
      const ok = await approveProduct(productId);
      if (ok) {
         //Change state if operation is ok
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
   }
   function toggleEditProductModal(product: AdminProduct) {
      dispatch(windowActions.toggleProductModal());
      dispatch(adminActions.selectProduct(product));
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
            <li className="mp_card" key={p.id}>
               <div className="mp_left">
                  <img className="mp_image" src={`${baseUrl}/${p.id}.png`} alt="" />
                  <div className="mp_content">
                     <span>
                        <p className="mp_title">
                           {p.translate}&nbsp;<small>/</small>
                        </p>
                     </span>
                     <p className="mp_subtitle">{p.name}</p>
                     <p className="mp_price">
                        {p.price} {currency}
                     </p>
                  </div>
               </div>
               <div className="mp_right">
                  <section>
                     <button className="mp_control">Подробнее</button>
                     <button className="mp_control bot" onClick={() => toggleEditProductModal(p)}>
                        Редактирование
                     </button>
                  </section>
                  <section>
                     <button
                        onClick={() => handleApprove(p.id)}
                        disabled={p.approved}
                        className={p.approved ? "mp_control end --green" : "mp_control end"}>
                        Показывать <br /> в каталоге
                     </button>
                     <button
                        onClick={() => handleApprove(p.id)}
                        disabled={!p.approved}
                        className={!p.approved ? "mp_control bot end --red" : "mp_control bot end"}>
                        Скрыть <br /> из каталога
                     </button>
                  </section>
               </div>
            </li>
         ))}
      </ul>
   );
};

export default CatalogManipulator;
