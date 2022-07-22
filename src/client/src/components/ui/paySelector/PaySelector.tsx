import React, { FC } from "react";
import "./pay-selector.styles.scss";
import { Pay } from "../../../common/types";

interface PaySelectorProps {
   selected: boolean;
   disabled: boolean;
   onClick: (opt: Pay) => void;
   opt: Pay;
}

const PaySelector: FC<PaySelectorProps> = ({ selected, disabled, opt, onClick }) => {
   return (
      <button disabled={disabled} onClick={() => onClick(opt)} className={disabled ? "pay_selector selector--disabled" : "pay_selector"}>
         {selected && <div className="selector">&nbsp;</div>}
      </button>
   );
};

export default PaySelector;
