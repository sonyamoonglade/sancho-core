import React, { useEffect, useState } from "react";
import { useAppSelector, windowSelector } from "../../../../redux";
import RectangleInput from "../../../ui/admin/rectangleInput/RectangleInput";
import EditDescription from "../../editDescription/EditDescription";
import ModalNutrient from "../../modalNutrient/ModalNutrient";
import { useCreateProductModalForm } from "./hooks/useCreateProductModalForm";
import "../product-modal.styles.scss";
import "./create-modal.styles.scss";
import { useAdminApi } from "../../../../hooks/useAdminApi";
import { useEvents } from "../../../../hooks/useEvents";
import { Events } from "../../../../events/Events";

const CreateProductModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const { inputw, formValues, setFormValues, setFormDefaults, getFormValues } = useCreateProductModalForm();
   const { getAvailableCategories, createProduct } = useAdminApi();
   const events = useEvents();
   //Available categories
   const [categs, setCategs] = useState<string[]>([]);

   useEffect(() => {
      if (admin.create) {
         getAvailableCategories().then((categs) => setCategs(categs.map((c) => c.name)));
      } else {
         setCategs([]);
         setFormDefaults();
      }
   }, [admin.create]);

   async function handleCreate() {
      const body = getFormValues();
      const ok = await createProduct(body);
      if (!ok) {
         //indicate an error
         return;
      }

      events.emit(Events.REFRESH_ADMIN_CATALOG);
   }

   return (
      <div className={admin.create ? "create product_modal --product-modal-active" : "create product_modal"}>
         <p className="product_modal_name">Создание новой позиции</p>
         <div className="create_content">
            <section>
               <div className="form_grid">
                  <p>Название</p>
                  <RectangleInput width={inputw} value={formValues.name} setValue={setFormValues} disabled={false} name={"name"} />

                  <p>Перевод</p>
                  <RectangleInput width={inputw} value={formValues.translate} setValue={setFormValues} disabled={false} name={"translate"} />

                  <p>Категория</p>
                  <RectangleInput width={inputw} value={formValues.category} setValue={setFormValues} disabled={false} name={"category"} />

                  <p>Цена</p>
                  <span>
                     <RectangleInput width={60} value={formValues.price} setValue={setFormValues} disabled={false} name={"price"} />
                     <strong>&nbsp;₽</strong>
                  </span>

                  <p>Описание</p>
                  <EditDescription value={formValues.description} valueLength={formValues.description.length} setValue={setFormValues} />

                  <p>Доп.</p>
                  <section className="edit_nutrients">
                     <ModalNutrient value={formValues.volume} setValue={setFormValues} name={"volume"} />
                     <ModalNutrient value={formValues.weight} setValue={setFormValues} name={"weight"} />
                     <ModalNutrient value={formValues.carbs} setValue={setFormValues} name={"carbs"} />
                     <ModalNutrient value={formValues.proteins} setValue={setFormValues} name={"proteins"} />
                     <ModalNutrient value={formValues.fats} setValue={setFormValues} name={"fats"} />
                  </section>
               </div>
            </section>
            <section
               style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-end",
                  justifyContent: "space-between"
               }}>
               <button className="mp_control end save" onClick={handleCreate}>
                  Добавить позицию
               </button>
               <div>
                  <p style={{ fontFamily: "Geometria Medium,sans-serif", textAlign: "right", marginBottom: "1rem" }}>Доступные категории</p>
                  <ul className="available_categories">
                     {categs?.map((categ) => (
                        <li key={categ} className="admin_category_item">
                           <p>{categ}</p>
                        </li>
                     ))}
                  </ul>
               </div>
            </section>
         </div>
      </div>
   );
};

export default CreateProductModal;
