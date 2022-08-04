import React, { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from "react";
import "./product-modal.styles.scss";
import { adminSelector, useAppDispatch, useAppSelector, windowSelector } from "../../../redux";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";
import ModalNutrient from "../modalNutrient/ModalNutrient";
import EditDescription from "../editDescription/EditDescription";

export interface EditFormState {
   name: string;
   translate: string;
   price: string;
   description: string;
   carbs: string;
   fats: string;
   proteins: string;
   volume: string;
   category: string;
}
const defaults: EditFormState = {
   name: "",
   translate: "",
   price: "",
   description: "",
   carbs: "",
   fats: "",
   proteins: "",
   volume: "",
   category: ""
};

const ProductModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const { selectedProduct } = useAppSelector(adminSelector);
   const [state, setState] = useState<EditFormState>(Object.assign({}, defaults));
   const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
   const [file, setFile] = useState<File>(null);

   const inputw = useMemo(() => {
      if (selectedProduct !== null) {
         //Long name
         if (selectedProduct.name.split(" ").length === 2) {
            return 220;
         }
         return 150;
      }
      return 0;
   }, [selectedProduct?.name]);

   useEffect(() => {
      if (selectedProduct && admin.productModal) {
         presetProductData();
         return;
      }
      setDefaults();
   }, [selectedProduct, admin.productModal]);

   function setDefaults() {
      setFile(null);
      setIsFileSelected(false);
      setState((state: EditFormState) => {
         const copy = Object.assign({}, state);
         copy.name = "";
         copy.translate = "";
         copy.price = "";
         copy.description = "";
         copy.carbs = "";
         copy.fats = "";
         copy.proteins = "";
         copy.volume = "";
         copy.category = "";
         return { ...copy };
      });
   }

   function presetProductData() {
      const { name, description, price, category, translate, features } = selectedProduct;
      setState((state: EditFormState) => {
         const copy = Object.assign({}, state);
         copy.name = name;
         copy.description = description;
         copy.category = category;
         copy.translate = translate;
         copy.price = price.toString();
         if (features.nutrients) {
            copy.carbs = features.nutrients.carbs.toString();
            copy.proteins = features.nutrients.proteins.toString();
            copy.fats = features.nutrients.fats.toString();
         }
         if (features.volume) {
            copy.volume = features.volume.toString();
         }
         return { ...copy };
      });
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
               <section>
                  <div className="label_control">
                     <label htmlFor="file">Загрузить фото</label>
                  </div>
                  <input onChange={handleFileSelect} type="file" id="file" className="file_upload" />
                  <button className="mp_control end save" onClick={handleSave}>
                     Сохранить изменения
                  </button>
                  {isFileSelected && (
                     <p className="filename">
                        Файл: <strong>{file.name}</strong>
                     </p>
                  )}
               </section>
            </div>
         </div>
      )
   );
};

export default ProductModal;
