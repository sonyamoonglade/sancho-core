import React from "react";
import "./usr-list.styles.scss";
interface UserListProps {
   listFor: string;
   children: any;
}

const UserList = ({ listFor, children }: UserListProps) => {
   return (
      <div className="admin_users_list">
         <p className="list_for_title">Список {listFor}</p>
         {children}
      </div>
   );
};

export default UserList;
