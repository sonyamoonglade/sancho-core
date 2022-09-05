export type Promotion = {
   promotion_id?: number;
   main_title: string;
   sub_title: string;
   sub_text: string;
};

export const promotions = "promotions";

export const InitPromotion: Promotion = {
   main_title: "Главный заголовок",
   sub_title: "Второй заголовок",
   sub_text: "Базовый текст"
};
