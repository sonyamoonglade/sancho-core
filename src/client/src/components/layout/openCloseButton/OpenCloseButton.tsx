import React, {FC} from 'react';
import {GrClose} from "react-icons/gr";
import {CgMenuGridO} from "react-icons/cg";

interface openCloseButtonProps {
    modalState: boolean
    toggleModalFn: any
}
const OpenCloseButton:FC<openCloseButtonProps> = ({modalState,toggleModalFn}) => {
    return (
        <>
            {modalState ?
                <GrClose onClick={toggleModalFn} size={20} className='menu_close_icon' /> :
                <CgMenuGridO onClick={toggleModalFn} size={25} />
            }
        </>
    );
};

export default OpenCloseButton;