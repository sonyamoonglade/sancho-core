import React from "react";
import "../../components/admin/catalog/adm-catalog.styles.scss";
import CatalogManipulator from "../../components/admin/catalog/CatalogManipulator";
import ProductModal from "../../components/admin/productModal/ProductModal";
const Catalog = () => {
   return (
      <div className="admin_catalog">
         <CatalogManipulator />
         <ProductModal />
      </div>
   );
};

export default Catalog;
