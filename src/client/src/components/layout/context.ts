import React from "react";

interface CatalogContextInterface {
   catalogRef: any;
}

export const CatalogContext = React.createContext<CatalogContextInterface>({
   catalogRef: null
});

interface LayoutContextInterface {
   layoutRef: any;
}
export const LayoutContext = React.createContext<LayoutContextInterface>({
   layoutRef: null
});
