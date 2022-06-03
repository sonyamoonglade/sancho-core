import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector, windowActions, windowSelector} from "../../redux";
import './loading.styles.scss'
import {SpinnerCircular} from 'spinners-react'
import {FaCheckCircle} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'
import {useDotsAnimation} from "./hooks/useDotsAnimation";

interface loadingProps {
   duration: number
}

enum loadingSteps {
    "starting" = "Отправляем заказ в пиццерию",
    "middle" = "Создаем заказ",
    "finish" = "Подготавливаем печи",
    "afterFinish" = "Готово!"
}

const Loading:FC<loadingProps> = ({duration}) => {

    const {loading, error,errorMessage} = useAppSelector(windowSelector)
    const dispatch = useAppDispatch()
    console.log(errorMessage)
    const {
        stepsAnimation,
        dotsAnimation,
        stopDotsAnimation,
        setDefaults,
        loadingStep,
        dots,
        stopDots
    } = useDotsAnimation()

    useEffect(() => {
        if(loading){
            const timePerStep = duration / 3
            const stepsAnimationInterval = setInterval(() => {
                stepsAnimation()
            },timePerStep)
            if(loadingStep === loadingSteps.finish){
                setTimeout(() => {
                    clearInterval(stepsAnimationInterval)
                    stopDotsAnimation()
                    setTimeout(finishLoadingAndCloseAllModals,2000)
                },2000)
            }
            return () => {
                clearInterval(stepsAnimationInterval)
            }
        }

    },[loading, loadingStep])
    useEffect(() => {
        if(loading){
            let i: any;
            if(loading && !stopDots){
                i = setInterval(dotsAnimation,500)
            }

            return () => clearInterval(i)
        }

    },[loading,dots,stopDots])
    useEffect(() => {
        if(loading){
            setDefaults()
            return () => {
                setTimeout(setDefaults,1000)
            }
        }
    },[loading])
    useEffect(() => {
        if(error) {
            const t = stopByError()
            return () => clearTimeout(t)
        }

    },[error])

    function finishLoadingAndCloseAllModals(){
        dispatch(windowActions.toggleLoading(false))
        dispatch(windowActions.closeAll())
        dispatch(windowActions.loadingSuccess())
    }
    function stopByError(){

        stopDotsAnimation()
        setDefaults()
        dispatch(windowActions.toggleLoading(false))
        const t = setTimeout(() => {
            dispatch(windowActions.stopErrorScreen())
        },5000)
        return t

    }

    return (
        <div className={(loading && !error) ? 'modal loading modal--visible' : 'modal loading'}>
            <div className="loading_content">
                {loadingStep !== loadingSteps.afterFinish && loading ?
                    <SpinnerCircular size={150} secondaryColor={"#ffc535"} color={"#3cb46e"} enabled={loading}/> :
                    <FaCheckCircle color={"#3cb46e"} size={60}/>
                }
                <p>{loadingStep}{dots}</p>
            </div>
            {
                error &&
                <div className='modal loading modal--visible'>
                    <div className="loading_content">
                        <AiFillCloseCircle  size={60} color={"#eb5757"} />
                        <p>Возникла ошибка! <br/> Повторите попытку еще раз.</p>
                        {
                            errorMessage !== null && <p className='error_message'>{errorMessage}</p>
                        }
                    </div>
                </div>
            }

        </div>
    );
};

export default React.memo(Loading);