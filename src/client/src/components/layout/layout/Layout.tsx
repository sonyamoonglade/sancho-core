import React, {FC} from 'react';

import './layout.styles.scss'
import "../../worker/worker-globals.scss"

import Header from "../header/Header";
import {useRoutes} from "../../../hooks/useRoutes";
import {useAppSelector, userSelector} from "../../../redux";
import VerifyOrderModal from "../../worker/verifyOrder/VerifyOrderModal";
import WorkerAppForm from "../../worker/appForm/WorkerAppForm";
import CreateOrderModal from "../../worker/createOrder/CreateOrderModal";
import VirtualCart from "../../worker/virtualCart/VirtualCart";


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
                    <VerifyOrderModal />
                    <CreateOrderModal />

                    <WorkerAppForm/>
                 </>
            }
        </div>
    );
};

export default Layout;