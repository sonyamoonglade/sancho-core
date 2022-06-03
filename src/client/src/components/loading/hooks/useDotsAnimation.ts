import {useState} from "react";
import {LoadingSteps} from "../Loading";


export function useDotsAnimation (){
    const [dots,setDots] = useState(".")
    const [stopDots, setStopDots] = useState(false)
    const [loadingStep, setLoadingStep] = useState<LoadingSteps>(LoadingSteps.starting)


    function stepsAnimation(){
        if(loadingStep === LoadingSteps.starting){
            setLoadingStep(LoadingSteps.middle)
        }
        else if(loadingStep === LoadingSteps.middle){
            setLoadingStep(LoadingSteps.finish)
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
        setLoadingStep(LoadingSteps.afterFinish)
        setDots("")
        setStopDots(true)
    }

    function setDefaults(){
        setDots(".")
        setLoadingStep(LoadingSteps.starting)
        setStopDots(false)
    }


    return {loadingStep,stepsAnimation, dotsAnimation,stopDotsAnimation, setDefaults,dots,stopDots}

}