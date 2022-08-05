import { useMemo, useState } from "react";
import { AdminProduct } from "../../../../types/types";

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

export function useProductModalForm(selectedProduct: AdminProduct) {
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
   function setFormDefaults() {
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

   return { state, inputw, setState, setFormDefaults, presetProductData };
}
