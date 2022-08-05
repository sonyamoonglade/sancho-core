import React, { FC } from "react";
import { EditFormState } from "../productModal/hooks/useProductModalForm";

interface EditDescriptionProps {
   value: any;
   valueLength: number;
   setValue: Function;
}

const EditDescription: FC<EditDescriptionProps> = ({ value, valueLength, setValue }) => {
   const descr: keyof EditFormState = "description";
   return (
      <textarea
         name={descr}
         id={descr}
         value={value}
         className="edit_description"
         cols={30}
         rows={Math.ceil(valueLength / 28)}
         maxLength={150}
         onChange={(e) =>
            setValue((state: EditFormState) => {
               const copy = Object.assign({}, state);
               copy[descr] = e.target.value;
               return { ...copy };
            })
         }
      />
   );
};

export default EditDescription;
