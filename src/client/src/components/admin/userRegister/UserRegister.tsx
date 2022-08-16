import React from "react";
import "./user-reg.styles.scss";
interface UserRegisterProps {
   registerFor: string;
   handlerFunc: Function;
   children: any;
}

const UserRegister = ({ registerFor, handlerFunc, children }: UserRegisterProps) => {
   return (
      <div className="user_register">
         <p className="register_title">Регистрация {registerFor}а</p>
         <div className="content">
            <div>{children}</div>
            <button type={"submit"} onClick={() => handlerFunc()} className="reg_handler">
               Добавить {registerFor}а
            </button>
         </div>
      </div>
   );
};

export default UserRegister;
