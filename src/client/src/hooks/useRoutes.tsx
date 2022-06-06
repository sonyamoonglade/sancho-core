import {Routes,Route,Navigate} from 'react-router-dom'
import OrderQueue from "../components/worker/queue/OrderQueue";
import {useMemo} from "react";

export function useRoutes(isWorkerAuthenticated: boolean){



    const auth = useMemo(() => (

        <Routes>
            <Route path='/worker/queue' element={<OrderQueue />} />
            <Route path='/worker/create' />
            <Route path='*' element={<Navigate to='/worker/queue'/>} />
        </Routes>

    ),[])




    if(isWorkerAuthenticated) { return auth }
    return null
}