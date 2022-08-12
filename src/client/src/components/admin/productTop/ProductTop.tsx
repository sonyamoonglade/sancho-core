import React, { useState } from "react";

const ProductTop = () => {
   const [productTop, setProductTop] = useState();
   return (
      <div className="product_top">
         <ul className="product_top_list"></ul>
      </div>
   );
};

export default ProductTop;
