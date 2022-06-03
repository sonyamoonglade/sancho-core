import React, {FC} from 'react';

import './layout.styles.scss'
import Header from "../header/Header";


interface layoutProps  {
    children: any
}

const Layout:FC<layoutProps> = ({children}) => {



    return (
        <div className='layout'>
            <Header />

            {children}


        </div>
    );
};

export default Layout;