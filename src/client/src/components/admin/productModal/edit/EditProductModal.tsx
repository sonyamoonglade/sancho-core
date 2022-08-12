import React, { useEffect, useState } from "react";
import "../product-modal.styles.scss";
import { adminSelector, useAppSelector, windowSelector } from "../../../../redux";
import RectangleInput from "../../../ui/admin/rectangleInput/RectangleInput";
import ModalNutrient from "../../modalNutrient/ModalNutrient";
import EditDescription from "../../editDescription/EditDescription";
import { useAdminApi } from "../../../../hooks/useAdminApi";
import { useEditProductModalForm } from "./hooks/useEditProductModalForm";
import { useEvents } from "../../../../hooks/useEvents";
import { Events } from "../../../../events/Events";

const EditProductModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const { selectedProduct } = useAppSelector(adminSelector);
   const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
   const [file, setFile] = useState<File>(null);
   const { uploadImage, updateProduct } = useAdminApi();
   const { state, setState, setFormDefaults, presetProductData, inputw, getFormValues } = useEditProductModalForm(selectedProduct);
   const events = useEvents();
   useEffect(() => {
      if (selectedProduct && admin.edit) {
         presetProductData();
         return;
      }
      setGlobDefaults();
   }, [selectedProduct, admin.edit]);

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
      const body = getFormValues();
      const ok = await updateProduct(body, selectedProduct.id);
      if (!ok) {
         //Indicate error
         return;
      }

      events.emit(Events.REFRESH_ADMIN_CATALOG);
   }

   return (
      selectedProduct && (
         <div className={admin.edit ? "product_modal --product-modal-active" : "product_modal"}>
            <p className="product_modal_name">Редактирование позиции</p>
            <div className="edit_content">
               <section>
                  <div className="form_grid">
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
                     {selectedProduct.features && (
                        <>
                           <p>Доп.</p>
                           <section className="edit_nutrients">
                              {selectedProduct.features.volume !== 0 && <ModalNutrient value={state.volume} setValue={setState} name={"volume"} />}
                              {selectedProduct.features.weight !== 0 && <ModalNutrient value={state.weight} setValue={setState} name={"weight"} />}
                           </section>
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

export default EditProductModal;
