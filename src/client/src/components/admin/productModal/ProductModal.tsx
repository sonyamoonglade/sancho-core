import React, { useMemo, useState } from "react";
import "./product-modal.styles.scss";
import { adminSelector, useAppDispatch, useAppSelector, windowSelector } from "../../../redux";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";

interface EditFormState {
   name: string;
   translate: string;
   price: string;
   description: string;
   carbs: string;
   fats: string;
   proteins: string;
   volume: string;
}
const defaults: EditFormState = {
   name: "",
   translate: "",
   price: "",
   description: "",
   carbs: "",
   fats: "",
   proteins: "",
   volume: ""
};

const ProductModal = () => {
   const dispatch = useAppDispatch();
   const { admin } = useAppSelector(windowSelector);
   const { selectedProduct } = useAppSelector(adminSelector);
   const [state, setState] = useState<EditFormState>(Object.assign({}, defaults));

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

   return (
      selectedProduct && (
         <div className={admin.productModal ? "product_modal --product-modal-active" : "product_modal"}>
            <p className="pos_name">Редактирование "{`${selectedProduct.translate}, ${selectedProduct.name}`}"</p>
            <div className="edit">
               <p>Название</p>
               <RectangleInput width={inputw} value={state.name} setValue={setState} disabled={false} name={"name"} />

               <p>Перевод</p>
               <RectangleInput width={inputw} value={state.translate} setValue={setState} disabled={false} name={"translate"} />

               <p>Цена</p>
               <span>
                  <RectangleInput width={60} value={state.price} setValue={setState} disabled={false} name={"price"} /> <strong>₽</strong>
               </span>

               <p>Описание</p>
               <textarea
                  name="description"
                  id="description"
                  value={state.description}
                  className="edit_description"
                  cols={30}
                  rows={Math.ceil(state.description.length / 31)}
                  maxLength={150}
                  onChange={(e) =>
                     setState((state) => {
                        const copy = Object.assign({}, state);
                        copy.description = e.target.value;
                        return { ...copy };
                     })
                  }
               />
            </div>
         </div>
      )
   );
};

export default ProductModal;
