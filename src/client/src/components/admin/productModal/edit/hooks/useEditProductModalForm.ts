import { useMemo, useState } from "react";
import { AdminProduct } from "../../../../../types/types";
import { Features } from "../../../../../common/types";

export interface EditFormState {
   name: string;
   translate: string;
   price: string;
   description: string;
   volume: string;
   weight: string;
}

export interface EditFormValues {
   name?: string;
   translate?: string;
   price?: number;
   description?: string;
   features?: Features;
}
const defaults: EditFormState = {
   name: "",
   translate: "",
   price: "",
   description: "",
   volume: "",
   weight: ""
};

export function useEditProductModalForm(selectedProduct: AdminProduct) {
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
         copy.volume = "";
         copy.weight = "";
         return { ...copy };
      });
   }
   function presetProductData() {
      const { name, description, price, translate, features } = selectedProduct;
      setState((state: EditFormState) => {
         const copy = Object.assign({}, state);
         copy.name = name;
         copy.description = description;
         copy.translate = translate;
         copy.price = price.toString();
         if (features.volume) {
            copy.volume = features.volume.toString();
         }
         if (features.weight) {
            copy.weight = features.weight.toString();
         }
         return { ...copy };
      });
   }

   function getFormValues(): EditFormValues {
      const { name, translate, description, price, volume, weight } = state;
      const out: EditFormValues = {
         features: {
            ...selectedProduct.features
         }
      };
      if (selectedProduct.name !== name) {
         out.name = name;
      }
      if (selectedProduct.price !== Number(price)) {
         out.price = Number(price);
      }
      if (selectedProduct.translate !== translate) {
         out.translate = translate;
      }
      if (selectedProduct.description !== description) {
         out.description = description;
      }
      if (selectedProduct?.features?.volume !== Number(volume) && volume !== "") {
         out.features.volume = Number(volume);
      }
      if (selectedProduct?.features?.weight !== Number(weight) && weight !== "") {
         out.features.weight = Number(weight);
      }
      return out;
   }

   return { state, inputw, setState, setFormDefaults, presetProductData, getFormValues };
}
