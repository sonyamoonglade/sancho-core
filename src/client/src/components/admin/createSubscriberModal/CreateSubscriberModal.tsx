import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, windowActions, windowSelector } from "../../../redux";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";
import "./create-sub-modal.styles.scss";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { useEvents } from "../../../hooks/useEvents";
import { Events } from "../../../events/Events";
interface CreateSubscriberFormValues {
   phone_number: string;
}

const CreateSubscriberModal = () => {
   const { admin } = useSelector(windowSelector);
   const [formValues, setFormValues] = useState<CreateSubscriberFormValues>(Object.assign({}, null));
   const { registerSubscriber } = useAdminApi();
   const dispatch = useAppDispatch();
   const events = useEvents();

   async function handleRegister() {
      const phoneNumber = formValues.phone_number;

      const ok = await registerSubscriber(phoneNumber);
      if (ok) {
         //If operation is successful - close modal
         dispatch(windowActions.toggleCreateSubscriber(false));
         events.emit(Events.REFETCH_SUBSCRIBERS);
      }
   }

   return (
      <div className={admin.createSubscriber ? "create_subscriber_modal --sub-modal-opened" : "create_subscriber_modal"}>
         <p className="create_sub_title">Регистрация подписчика</p>
         <div className="content_create">
            <div>
               <p>Номер телефона</p>
               <RectangleInput
                  width={350}
                  maxLength={11}
                  placeholder={"89128510221"}
                  regexp={new RegExp("[0-9]+")}
                  value={formValues.phone_number}
                  setValue={setFormValues}
                  disabled={false}
                  name={"phone_number"}
               />
            </div>
            <button onClick={handleRegister} className="register_subscriber_btn">
               Зарегистрировать
            </button>
         </div>
      </div>
   );
};

export default CreateSubscriberModal;
