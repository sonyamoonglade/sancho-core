import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, windowActions, windowSelector, workerSelector } from "../../../../redux";
import "./mark-modal.styles.scss";
import { useMarkForm } from "./hooks/useMarkForm";
import LiveSearch, { Livesearch } from "../../liveSearch/LiveSearch";
import LsUserResultContainer from "./LSUserResultContainer";
import { FoundUser } from "../../../../types/types";
import FormInput from "../../../ui/formInput/FormInput";
import { useFormValidations } from "../../../../hooks/useFormValidations";
import { useMark } from "./hooks/useMark";

const MarkModal = () => {
   const { worker } = useAppSelector(windowSelector);
   const { findUserQueryResults } = useAppSelector(workerSelector);
   const dispatch = useAppDispatch();

   const { setFormDefaults, formValues, setPhoneNumber, setFormValues, getFormValues, setIsImportant, isSubmitButtonActive } = useMarkForm();
   const [username, setUsername] = useState<string>("");

   const focusRef = useRef<HTMLInputElement>(null);
   const reFocusRef = useRef<HTMLDivElement>(null);
   const { minLengthValidation } = useFormValidations();
   const { createMark } = useMark();

   const onlyPhoneNumberRegexp = useMemo(() => {
      return new RegExp("!?[A-Za-z]+|[-!,._\"`'#%&:;<>=@{}~\\$\\(\\)\\*\\+\\/\\\\\\?\\[\\]\\^\\|]+");
   }, []);

   function handleSelectOnUser(user: FoundUser) {
      const withoutCityPrefix = user.phoneNumber.substring(2, user.phoneNumber.length);
      setPhoneNumber(withoutCityPrefix);
      setUsername(user.username);
   }
   function handleImportantChange(e: any) {
      const v: boolean = JSON.parse(e.target.value);
      setIsImportant(v);
   }
   async function handleMarkCreate() {
      if (!isSubmitButtonActive) {
         return;
      }
      const body = getFormValues();
      const ok = await createMark(body);
      if (ok) {
         //TODO: show alert here
      }
      dispatch(windowActions.toggleMark());
      return;
   }

   useEffect(() => {
      if (!worker.mark) {
         setFormDefaults();
         setUsername("");
      }
   }, [worker.mark]);

   return (
      <div className={worker.mark ? "mark worker_modal --w-opened" : "mark worker_modal"}>
         <p className="modal_title">Прикрепить метку</p>
         <LiveSearch focusRef={focusRef} type={Livesearch.PHONE_NUMBER} regexp={onlyPhoneNumberRegexp} />
         <LsUserResultContainer onSelect={handleSelectOnUser} result={findUserQueryResults} />
         <div className="user_info">
            <div className="info_row">
               <p>Имя пользователя:</p>
               <p>{username || "-"}</p>
            </div>
            <div className="info_row">
               <p>Номер телефона:</p>
               <p>
                  {formValues.phoneNumber.isValid ? "+7" : ""}
                  {formValues.phoneNumber.value || "-"}
               </p>
            </div>
         </div>
         <p className="mark_title">Секция создания</p>
         <FormInput
            name={"content"}
            type={"text"}
            placeholder={"Текст метки..."}
            setV={setFormValues}
            onBlurValue={""}
            minLength={3}
            maxLength={15}
            formValue={formValues.content}
            fieldValidationFn={minLengthValidation}
         />
         <div className="importance_check">
            <p className="mark_title">Отметить как важную?</p>
            <span>
               <p>да</p>
               <input type="radio" name="important" value="true" onChange={handleImportantChange} checked={formValues.isImportant.value} />
            </span>
            <span>
               <p>нет</p>
               <input type="radio" name="important" value="false" onChange={handleImportantChange} checked={!formValues.isImportant.value} />
            </span>
         </div>
         <button onClick={handleMarkCreate} className={isSubmitButtonActive ? "modal_button" : "modal_button --red"}>
            Присвоить метку
         </button>
      </div>
   );
};

export default React.memo(MarkModal);
