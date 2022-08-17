import React from "react";
import "./../userList/usr-list.styles.scss";
import UserList from "../userList/UserList";
import { adminSelector, useAppSelector } from "../../../redux";
const RunnerList = () => {
   const { users } = useAppSelector(adminSelector);
   return (
      <div className="runner_list">
         <UserList listFor={"курьеров"}>
            <ul>
               {users.runners?.map((runner) => (
                  <li className="user_card" key={runner.username}>
                     <div>
                        <p>ФИ: {runner.username}</p>
                        <p>Номер телефона: {runner.phone_number}</p>
                     </div>
                     <div>
                        <button className="user_button">Забанить</button>
                     </div>
                  </li>
               ))}
            </ul>
         </UserList>
      </div>
   );
};

export default RunnerList;
