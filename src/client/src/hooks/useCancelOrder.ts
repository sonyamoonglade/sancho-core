import {useRef, useState} from "react";
import {cancelOrder, useAppDispatch, useAppSelector, userSelector} from "../redux";
import {useAxios} from "./useAxios";
import {OrderStatus, ResponseUserOrder} from "../common/types";


export function useCancelOrder (order:ResponseUserOrder){
    const [x, setX] = useState(0)
    const [cx, setCX] = useState({
        prev: 0,
        curr: 0,
    })
    const [isCanceling, setIsCanceling] = useState<boolean>(false)
    const [isAnimating,setIsAnimating] = useState(false)
    const animationRef = useRef<HTMLLIElement>(null)
    const cancelIconAnimationRef = useRef<HTMLSpanElement>(null)
    const dispatch = useAppDispatch()
    const {phoneNumber} = useAppSelector(userSelector)
    const {client} = useAxios()

    let screenWidthX: number
    let cancelBreakpoint: number
    function animateBin(){
        setIsAnimating(true)
        if(cancelIconAnimationRef.current !== null){
            cancelIconAnimationRef.current.style.transform = "translateX(-25%)"
        }
        setIsAnimating(false)
    }
    function onMove(e:any){
        if(order.status === OrderStatus.cancelled){ return }
        if(!screenWidthX && animationRef.current !== null){
            screenWidthX = animationRef.current.getBoundingClientRect().width
        }
        if(!cancelBreakpoint){
            cancelBreakpoint = screenWidthX * 0.4
        }
        const clx = e.touches[0].clientX

        if(x < cancelBreakpoint){
            setIsCanceling(false)
        }
        if(x >= cancelBreakpoint){
            setIsCanceling(true)
        }
        if(isCanceling) {
            setCX((p) => {
                return { curr: clx,prev: p.curr }
            })
            setX((x) => {
                if( cx.prev > cx.curr ){ return x - 2 }
                return x
            })

            if(!isAnimating){ animateBin() }
            return
        }
        if(!isCanceling){
           if(cancelIconAnimationRef.current !== null){  cancelIconAnimationRef.current.style.transform = "translateX(0%)" }
        }


        setCX((p) => {
            return { curr: clx,prev: p.curr }
        })
        setX((x) => {
            if(cx.prev > cx.curr && x > 0) { return x - 2}
            if( cx.prev > cx.curr ){ return x }
            return x + 2
        })
    }
    function onEnd(){


        if(isCanceling && order.status === OrderStatus.waiting_for_verification){
            dispatch(cancelOrder(client,order.id,phoneNumber))
        }

        if(animationRef.current !== null && cancelIconAnimationRef.current !== null){
            animationRef.current.style.transform = 'translateX(0)'
            cancelIconAnimationRef.current.style.transform = "translateX(0%)"
        }
        setCX({
            prev:0,
            curr: 0
        })
        setX(0)
        setIsCanceling(false)
    }

    return {onMove, onEnd,animationRef, cancelIconAnimationRef,x}
}