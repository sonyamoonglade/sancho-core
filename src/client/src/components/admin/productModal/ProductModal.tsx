import React, { useEffect, useState } from "react";
import "./product-modal.styles.scss";
import { adminSelector, useAppSelector, windowSelector } from "../../../redux";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";
import ModalNutrient from "../modalNutrient/ModalNutrient";
import EditDescription from "../editDescription/EditDescription";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { useProductModalForm } from "./hooks/useProductModalForm";
import { useEvents } from "../../../hooks/useEvents";
import { Events } from "../../../events/Events";

const ProductModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const { selectedProduct } = useAppSelector(adminSelector);
   const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
   const [file, setFile] = useState<File>(null);
   const { uploadImage } = useAdminApi();
   const { state, setState, setFormDefaults, presetProductData, inputw } = useProductModalForm(selectedProduct);
   const events = useEvents();
   useEffect(() => {
      if (selectedProduct && admin.productModal) {
         presetProductData();
         return;
      }
      setGlobDefaults();
   }, [selectedProduct, admin.productModal]);

   function setGlobDefaults() {
      setFile(null);
      setIsFileSelected(false);
      setFormDefaults();
   }

   function handleFileSelect(event: any) {
      const v: string = event.target.value;
      const f: File = event.target.files[0];
      //Indication that NO item was selected
      if (v !== "") {
         setIsFileSelected(true);
         setFile(f);
         return;
      }
      setIsFileSelected(false);
   }

   async function handleSave() {
      /*
         1. Put image
         2. If ok: save the rest of the edits
         3. If ok: indicate success and close modal
       */

      if (file) {
         const ok = await uploadImage(file, selectedProduct.id);
         if (!ok) {
            //Indicate an error
            return;
         }
      }
      //Save the rest
      events.emit(Events.REFRESH_ADMIN_CATALOG);
   }

   return (
      selectedProduct && (
         <div className={admin.productModal ? "product_modal --product-modal-active" : "product_modal"}>
            <p className="edit_product_name">Редактирование позиции</p>
            <div className="edit_content">
               <section>
                  <div className="edit">
                     <p>Название</p>
                     <RectangleInput width={inputw} value={state.name} setValue={setState} disabled={false} name={"name"} />

                     <p>Перевод</p>
                     <RectangleInput width={inputw} value={state.translate} setValue={setState} disabled={false} name={"translate"} />

                     <p>Цена</p>
                     <span>
                        <RectangleInput width={60} value={state.price} setValue={setState} disabled={false} name={"price"} />
                        <strong>&nbsp;₽</strong>
                     </span>

                     <p>Описание</p>
                     <EditDescription value={state.description} valueLength={state.description.length} setValue={setState} />
                     {selectedProduct.features.nutrients && (
                        <>
                           <p>Нутриенты</p>
                           <section className="edit_nutrients">
                              <ModalNutrient value={state.carbs} setValue={setState} name={"carbs"} />
                              <ModalNutrient value={state.proteins} setValue={setState} name={"proteins"} />
                              <ModalNutrient value={state.fats} setValue={setState} name={"fats"} />
                           </section>
                        </>
                     )}
                     {selectedProduct.features.volume && (
                        <>
                           <p>Объем</p>
                           <span>
                              <RectangleInput width={60} value={state.volume} setValue={setState} disabled={false} name={"volume"} />{" "}
                              <strong>мл</strong>
                           </span>
                        </>
                     )}
                  </div>
               </section>
               <section style={{ width: "100%", display: "flex", flexDirection: "column", alignContent: "flex-end" }}>
                  <div className="label_control">
                     <label htmlFor="file">Загрузить фото</label>
                  </div>

                  <input onChange={handleFileSelect} type="file" id="file" className="file_upload" />

                  {isFileSelected && (
                     <p className="filename">
                        Файл: <strong>{file.name}</strong>
                     </p>
                  )}
                  <button className="mp_control end save" onClick={handleSave}>
                     Сохранить изменения
                  </button>
               </section>
            </div>
         </div>
      )
   );
};

export default ProductModal;
