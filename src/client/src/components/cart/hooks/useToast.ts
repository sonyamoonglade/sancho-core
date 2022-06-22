import { useRef, useState } from "react";

export function useToast() {
   const [isClicked, setIsClicked] = useState(false);
   const [isActive, setIsActive] = useState(false);
   const toastRef = useRef<HTMLDivElement>(null);
   const toastMsgRef = useRef<HTMLParagraphElement>(null);
   function notifyUser() {
      setIsClicked(true);
      if (!isActive) {
         setIsActive(true);
         setTimeout(() => {
            if (!isActive) {
               setIsActive(false);
            }
         }, 5000);
      }
   }

   return { isClicked, isActive, toastMsgRef, toastRef, notifyUser };
}
