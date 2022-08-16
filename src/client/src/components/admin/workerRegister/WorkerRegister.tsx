import React, { useEffect, useState } from "react";
import "../userRegister/user-reg.styles.scss";
import UserRegister from "../userRegister/UserRegister";
import RectangleInput from "../../ui/admin/rectangleInput/RectangleInput";
import { useWorkerRegisterForm } from "./hooks/useWorkerRegisterForm";
import { useAdminApi } from "../../../hooks/useAdminApi";

const WorkerRegister = () => {
   const { formValues, setFormValues, setFormDefaults } = useWorkerRegisterForm();
   const { registerWorker } = useAdminApi();

   async function handleRegister() {
      const body = formValues;
      const user = await registerWorker(body);
      console.log(user);
   }
   useEffect(() => {
      return () => setFormDefaults();
   }, []);

   return (
      <div className="worker_register">
         <UserRegister registerFor={"Воркер"} handlerFunc={handleRegister}>
            <section className="register_field">
               <p>Имя и фамилия</p>
               <RectangleInput placeholder={"Иван Иванов"} value={formValues.name} setValue={setFormValues} disabled={false} name={"name"} />
            </section>
            <section className="register_field">
               <p>Логин</p>
               <RectangleInput
                  placeholder={"www.examplelogin"}
                  minLength={15}
                  required={true}
                  value={formValues.login}
                  setValue={setFormValues}
                  disabled={false}
                  name={"login"}
               />
            </section>
            <section className="register_field">
               <p>Пароль</p>
               <RectangleInput
                  minLength={15}
                  required={true}
                  value={formValues.password}
                  setValue={setFormValues}
                  disabled={false}
                  name={"password"}
               />
            </section>
         </UserRegister>
      </div>
   );
};

export default WorkerRegister;
