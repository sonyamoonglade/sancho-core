import React from "react";
import "../../components/admin/MPCatalog/adm-catalog.styles.scss";
import CatalogManipulator from "../../components/admin/MPCatalog/CatalogManipulator";
import EditProductModal from "../../components/admin/productModal/edit/EditProductModal";
import CreateProductModal from "../../components/admin/productModal/create/CreateProductModal";
import DeleteModal from "../../components/admin/deleteModal/DeleteModal";
import ProductTop from "../../components/admin/productTop/ProductTop";
import CategoryManagerProductModal from "../../components/admin/productModal/categoryManager/CategoryManagerProductModal";
import Error from "../../components/worker/error/Error";

const Catalog = () => {
   return (
      <div className="admin_catalog">
         <CatalogManipulator />
         <ProductTop />
         <EditProductModal />
         <CreateProductModal />
         <DeleteModal />
         <CategoryManagerProductModal />
         <Error />
      </div>
   );
};

export default Catalog;
