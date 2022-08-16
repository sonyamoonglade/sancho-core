import React from "react";
import "./../userList/usr-list.styles.scss";
import UserList from "../userList/UserList";
import { adminSelector, useAppSelector } from "../../../redux";
const MasterList = () => {
   const { users } = useAppSelector(adminSelector);
   return (
      <div className="runner_list">
         <UserList listFor={"Воркеры"}>
            <ul>
               {users.workers?.map((worker) => (
                  <li className="user_card" key={worker.name}>
                     <div>
                        <p>ФИ: {worker.name}</p>
                        <p>Логин: {worker.login}</p>
                     </div>
                     <div>
                        <button className="user_button">Посмотреть пароль</button>
                        <button className="user_button">Забанить</button>
                     </div>
                  </li>
               ))}
            </ul>
         </UserList>
      </div>
   );
};

export default MasterList;
