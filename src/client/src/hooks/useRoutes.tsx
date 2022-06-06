import {Routes,Route,Navigate} from 'react-router-dom'
import OrderQueueComponent from "../components/worker/queue/OrderQueueComponent";
import {useMemo} from "react";

export function useRoutes(isWorkerAuthenticated: boolean){



    const auth = useMemo(() => (

        <Routes>
            <Route path='/worker/queue' element={<OrderQueueComponent />} />
            <Route path='/worker/create' />
            <Route path='*' element={<Navigate to='/worker/queue'/>} />
        </Routes>

    ),[])




    if(isWorkerAuthenticated) { return auth }
    return null
}