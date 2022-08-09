import { Features } from "../../../../../common/types";
import { useMemo, useState } from "react";

export interface CreateFormState {
   category: string;
   name: string;
   translate: string;
   price: string;
   volume?: string;
   weight: string;
   carbs?: string;
   proteins?: string;
   fats?: string;
   description: string;
}
export interface CreateFormValues {
   category: string;
   name: string;
   translate: string;
   price: number;
   features: Features;
   description: string;
}

const defaults: CreateFormState = {
   category: "",
   name: "",
   translate: "",
   price: "",
   volume: "",
   weight: "",
   carbs: "",
   proteins: "",
   fats: "",
   description: ""
};

export function useCreateProductModalForm() {
   const [formValues, setFormValues] = useState<CreateFormState>(Object.assign({}, defaults));

   function setFormDefaults(): void {
      setFormValues((state: CreateFormState) => {
         const copy = Object.assign({}, state);
         copy.price = "";
         copy.name = "";
         copy.description = "";
         copy.volume = "";
         copy.proteins = "";
         copy.carbs = "";
         copy.category = "";
         copy.fats = "";
         copy.weight = "";
         copy.translate = "";
         return { ...copy };
      });
   }

   const inputw = useMemo(() => {
      //Long name
      if (formValues?.name?.split(" ").length === 2) {
         return 220;
      }
      return 150;
   }, [formValues?.name]);

   function getFormValues(): CreateFormValues {
      const { carbs, category, fats, name, translate, weight, price, description, proteins, volume } = formValues;
      //todo: energy value handle
      const out: CreateFormValues = {
         features: {
            energy_value: 0,
            volume: Number(volume),
            weight: Number(weight),
            nutrients: {
               carbs: Number(carbs),
               fats: Number(fats),
               proteins: Number(proteins)
            }
         },
         name,
         translate,
         description,
         category,
         price: Number(price)
      };

      //Nullify nutrients for categories such as drinks
      if (!carbs || !proteins || !fats) {
         out.features.nutrients = null;
      }

      return out;
   }

   return { setFormValues, setFormDefaults, formValues, inputw, getFormValues };
}
