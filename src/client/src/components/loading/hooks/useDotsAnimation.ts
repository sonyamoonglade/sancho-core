import {useState} from "react";

interface loadingProps {
    duration: number
}

enum loadingSteps {
    "starting" = "Отправляем заказ в пиццерию",
    "middle" = "Создаем заказ",
    "finish" = "Подготавливаем печи",
    "afterFinish" = "Готово!"
}
export function useDotsAnimation (){
    const [dots,setDots] = useState(".")
    const [stopDots, setStopDots] = useState(false)
    const [loadingStep, setLoadingStep] = useState<loadingSteps>(loadingSteps.starting)


    function stepsAnimation(){
        if(loadingStep === loadingSteps.starting){
            setLoadingStep(loadingSteps.middle)
        }
        else if(loadingStep === loadingSteps.middle){
            setLoadingStep(loadingSteps.finish)
        }
    }

    function dotsAnimation(){
        if(dots.length < 3){
            setDots(p => {
                const v =  p + "."
                return  v
            })
        }else {
            setDots(".")
        }
    }

    function stopDotsAnimation(){
        setLoadingStep(loadingSteps.afterFinish)
        setDots("")
        setStopDots(true)
    }

    function setDefaults(){
        setDots(".")
        setLoadingStep(loadingSteps.starting)
        setStopDots(false)
    }


    return {loadingStep,stepsAnimation, dotsAnimation,stopDotsAnimation, setDefaults,dots,stopDots}

}