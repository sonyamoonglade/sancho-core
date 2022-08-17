import React, { useEffect, useState } from "react";
import "../userRegister/user-reg.styles.scss";
import UserRegister from "../userRegister/UserRegister";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";
import { BiCategoryAlt, BiCategory } from "react-icons/bi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { useRunnerRegisterForm } from "./hooks/useRunnerRegisterForm";
import { useAdminApi } from "../../../hooks/useAdminApi";
import { adminActions, useAppDispatch } from "../../../redux";
import { RunnerUser } from "../../../common/types";

const WorkerRegister = () => {
   const { formValues, setFormValues, setFormDefaults, getFormValues } = useRunnerRegisterForm();
   const { fetchMastersAndRunners, registerRunner } = useAdminApi();
   const dispatch = useAppDispatch();

   async function handleRegister() {
      const body = getFormValues();
      await registerRunner(body);
      dispatch(adminActions.appendRunner(body));
   }

   async function fetchMastersRunnersAsync() {
      const { workers, runners } = await fetchMastersAndRunners();
      dispatch(adminActions.setWorkers(workers));
      dispatch(adminActions.setRunners(runners));
   }

   useEffect(() => {
      fetchMastersRunnersAsync();
      return () => {
         setFormDefaults();
      };
   }, []);

   return (
      <div className="runner_register">
         <UserRegister registerFor={"Курьер"} handlerFunc={handleRegister}>
            <section className="register_field">
               <p>Имя и фамилия</p>
               <RectangleInput placeholder={"Иван Иванов"} value={formValues.name} setValue={setFormValues} disabled={false} name={"name"} />
            </section>
            <section className="register_field">
               <p>Номер телефона</p>
               <RectangleInput
                  maxLength={11}
                  placeholder={"89128510221"}
                  regexp={new RegExp("[0-9]+")}
                  value={formValues.phoneNumber}
                  setValue={setFormValues}
                  disabled={false}
                  name={"phoneNumber"}
               />
            </section>
            <div className="fillers">
               <BiCategoryAlt size={30} />
               <BiCategory size={30} />
               <MdOutlineDeliveryDining size={30} />
            </div>
         </UserRegister>
      </div>
   );
};

export default WorkerRegister;
