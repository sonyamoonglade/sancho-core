import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "./worker-nav.styles.scss";
import { useAppDispatch, userActions } from "../../../redux";
import { useAxios } from "../../../hooks/useAxios";
import { logout } from "../../../redux/user/user-async.actions";

const WorkerNavigationRight = () => {
   const dispatch = useAppDispatch();
   const client = useAxios();
   function handleLogout() {
      dispatch(logout(client));
   }

   return (
      <div className="d_right_part work">
         <FaUserCircle onClick={handleLogout} className="user_icon" size={35} />
         <p onClick={handleLogout} className="logout_text">
            Выйти{" "}
         </p>
      </div>
   );
};

export default WorkerNavigationRight;
