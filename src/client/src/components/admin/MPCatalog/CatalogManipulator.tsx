import React, { useEffect, useState } from "react";
import "./adm-catalog.styles.scss";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { IoIosAddCircleOutline } from "react-icons/io";
import MPItem from "../MPItem/MPItem";
import { AdminProduct } from "../../../types/types";
import { useEvents } from "../../../hooks/useEvents";
import { Events } from "../../../events/Events";
import { adminActions, useAppDispatch, windowActions } from "../../../redux";
import { BiCategoryAlt } from "react-icons/bi";

const CatalogManipulator = () => {
   const [products, setProducts] = useState<AdminProduct[]>([]);
   const { fetchAdminCatalog } = useAdminApi();
   const events = useEvents();
   const dispatch = useAppDispatch();
   useEffect(() => {
      fetchCatalog();
      registerRefreshEvent();
   }, []);

   function fetchCatalog() {
      dispatch(adminActions.setIsProductsLoading(true));
      fetchAdminCatalog().then((products) => {
         setProducts(products);
         setTimeout(() => {
            dispatch(adminActions.setIsProductsLoading(false));
         }, 200);
      });
   }

   function registerRefreshEvent() {
      events.on(Events.REFRESH_ADMIN_CATALOG, () => {
         window.location.reload();
      });
   }

   //Indication of local approval without fetching catalog (run only if receive 200 OK)
   function locallyApproveProduct(productId: number) {
      setProducts((products) => {
         return products?.map((p) => {
            if (p.id === productId) {
               p.approved = !p.approved;
               return p;
            }
            return p;
         });
      });
   }

   function handleToggleCreate() {
      dispatch(windowActions.toggleCreateModal());
   }
   function handleToggleCategoryManage() {
      dispatch(windowActions.toggleCategoryManager());
   }

   return (
      <ul className="manipulator">
         <li className="mp_card">
            <div className="mp_add">
               <p className="mp_title">Добавить новую позицию</p>
               <IoIosAddCircleOutline onClick={handleToggleCreate} size={35} />
            </div>
         </li>{" "}
         <li className="mp_card">
            <div className="mp_add">
               <p className="mp_title">Управление категориями</p>
               <BiCategoryAlt onClick={handleToggleCategoryManage} size={35} />
            </div>
         </li>
         {products?.map((p) => (
            <MPItem product={p} key={p.id} locallyApprove={locallyApproveProduct} />
         ))}
      </ul>
   );
};

export default React.memo(CatalogManipulator);
