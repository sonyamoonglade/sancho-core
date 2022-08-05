import { DatabaseCartProduct, DeliveryDetails } from "../common/types";
import { CookieOptions } from "express";
import { Categories, Features } from "../../../common/types";

export enum CategoryColor {
   "Напитки" = "#6fbecf",
   "Пицца" = "#eb5757",
   "Закуски" = "#3cb46e"
}

export interface CartInterface {
   addProduct(product: DatabaseCartProduct): void;
   removeProduct(id: number): void;
   getById(id: number): DatabaseCartProduct | undefined;
   getCart(): DatabaseCartProduct[];
   clearCart(): void;
   calculateCartTotalPrice(): number;
}

export enum OrderStatusTranslate {
   waiting_for_verification = "Ждет подтверждения",
   verified = "Подтвержден",
   completed = "Приготовлен",
   cancelled = "Отменен"
}

export const DATE_FORMAT_TEMPLATE = "DD MMM HH:mm";

export enum EventTypes {
   ORDER_CANCELLED = "order_cancelled"
}

export enum ScreenBreakpoints {
   large = 1440,
   medium = 1024,
   small = 768
}

export enum AppResponsiveState {
   mobileOrTablet,
   computer
}

export interface FormField {
   isValid: boolean;
   value: string;
}

export enum CancelExplanationPresets {
   CUSTOMER_WILL = "Заказ отменен по инициативе заказчика.",
   SYSTEM_ERROR = "Произошла ошибка в системе.",
   ORDER_ERROR = "Произошла ошибка в заказе.",
   CUSTOM = "Своя"
}

export type Mark = {
   id?: number;
   user_id: number;
   content: string;
   is_important: boolean;
   created_at: Date;
};

export type FoundUser = {
   phoneNumber: string;
   username: string;
};
//todo: move to events
export const CLEAR_ORDER_FORM = "clear_order_form";
export const CLEAR_ORDER_FORM_ONLY_PHONE = "clear_order_form_only_phone";

export type UserOrderFormData = {
   cart: DatabaseCartProduct[];
   delivery_details?: DeliveryDetails;
   phone_number: string;
   is_delivered_asap: boolean;
   is_delivered: boolean;
};

export type AppCookies = {
   phoneNumber: AppCookie;
   deliveryDetails: AppCookie;
};

export type AppCookie = {
   value: any;
   set: (value: string) => void;
};

export type AdminProduct = {
   id?: number;
   category: Categories;
   features: Features;
   name: string;
   translate: string;
   price: number;
   description?: string;
   approved?: boolean;
   currency?: string;
   has_image?: boolean;
};
