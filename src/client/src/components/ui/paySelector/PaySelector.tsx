import React, { FC } from "react";
import "./pay-selector.styles.scss";
import { Pay } from "../../../common/types";

interface PaySelectorProps {
   selected: boolean;
   onClick: (opt: Pay) => void;
   opt: Pay;
}

const PaySelector: FC<PaySelectorProps> = ({ selected, opt, onClick }) => {
   return (
      <button onClick={() => onClick(opt)} className="pay_selector">
         {selected && <div className="selector">&nbsp;</div>}
      </button>
   );
};

export default PaySelector;
