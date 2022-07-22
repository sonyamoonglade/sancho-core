import React, { FC } from "react";
import "./pay-selector.styles.scss";

interface PaySelectorProps {
   selected: boolean;
   disabled: boolean;
}

const PaySelector: FC<PaySelectorProps> = ({ selected, disabled }) => {
   return <button className="pay_selector">{selected && <div className="selector">&nbsp;</div>}</button>;
};

export default PaySelector;
