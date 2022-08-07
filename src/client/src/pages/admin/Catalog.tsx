import React from "react";
import "../../components/admin/MPCatalog/adm-catalog.styles.scss";
import CatalogManipulator from "../../components/admin/MPCatalog/CatalogManipulator";
import EditProductModal from "../../components/admin/productModal/edit/EditProductModal";
import CreateProductModal from "../../components/admin/productModal/create/CreateProductModal";

const Catalog = () => {
   return (
      <div className="admin_catalog">
         <CatalogManipulator />
         <EditProductModal />
         <CreateProductModal />
      </div>
   );
};

export default Catalog;
