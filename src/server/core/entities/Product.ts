import { Categories, Features } from "../../../common/types";

export type Product = {
   id?: number;
   category: Categories;
   features: Features | string;
   name: string;
   translate: string;
   price: number;
   description?: string;
   currency?: string;
   has_image?: boolean;
};
export const products = "products";
