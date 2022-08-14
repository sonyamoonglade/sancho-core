import { Categories, Features } from "../../../common/types";

export type Product = {
   id?: number;
   category_id: number;
   features: Features | string;
   name: string;
   translate: string;
   price: number;
   description: string;
   approved: boolean;
   currency: string;
   image_url: string;
   has_image: boolean;
};

export type FrontendProduct = {
   id?: number;
   category: string;
   features: Features | string;
   name: string;
   image_url: string;
   translate: string;
   price: number;
   description?: string;
};
export const products = "products";
