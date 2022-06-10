import React from 'react';
import {FaUserCircle} from "react-icons/fa";
import './worker-nav.styles.scss'
import {useAppDispatch, userActions} from "../../../redux";

const WorkerNavigationRight = () => {

    const dispatch = useAppDispatch()

    function handleLogout(){
        dispatch(userActions.logoutMaster())

    }

    return (
        <div className='d_right_part work'>
            <FaUserCircle onClick={handleLogout} className='user_icon' size={35}/>
            <p onClick={handleLogout} className='logout_text'>Выйти </p>
        </div>
    );
};

export default WorkerNavigationRight;