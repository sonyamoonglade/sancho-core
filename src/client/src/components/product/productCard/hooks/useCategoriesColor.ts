import { Categories } from "../../../../common/types";

export function useCategoriesColor(category: string): string {
   let color;
   switch (category) {
      case Categories.PIZZA:
         color = "--green-normal";
         break;
      case Categories.DRINKS:
         color = "--dark-blue";
         break;
      case Categories.SUSHI:
         color = "--red";
         break;
      case Categories.DESSERT:
         color = "--pink";
         break;
   }

   return color;
}
