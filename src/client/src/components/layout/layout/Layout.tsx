import React, {FC} from 'react';

import './layout.styles.scss'
import Header from "../header/Header";
import {useRoutes} from "../../../hooks/useRoutes";
import {useAppSelector, userSelector} from "../../../redux";
import SubmitOrderModal from "../../worker/submitOrder/SubmitOrderModal";
import WorkerAppForm from "../../worker/appForm/WorkerAppForm";


interface layoutProps  {
    children: any
}

const Layout:FC<layoutProps> = ({children}) => {
    const {isMasterAuthenticated} = useAppSelector(userSelector)
    const routes = useRoutes(isMasterAuthenticated)



    return (
        <div className='layout'>
             <Header />

            {isMasterAuthenticated ? null : children}

            {routes}

            {isMasterAuthenticated &&
                <>
                    <SubmitOrderModal />
                    <WorkerAppForm/>
                 </>
            }
        </div>
    );
};

export default Layout;