export enum AppRoles {
   worker = "worker",
   master = "master",
   user = "user"
}
export enum OrderStatus {
   waiting_for_verification = "waiting_for_verification",
   verified = "verified",
   completed = "completed",
   cancelled = "cancelled"
}
export interface DeliveryDetails {
   address: string;
   entrance_number: number;
   floor: number;
   flat_call: number;
   delivered_at?: Date;
   comment?: string;
}

export interface Features {
   weight: number;
   energy_value?: number;
   volume?: number;
   nutrients?: nutrients;
}

export type nutrients = {
   carbs: number;
   fats: number;
   proteins: number;
};

export type Product = {
   id: number;
   image_url: string;
   category: Categories;
   features: Features;
   name: string;
   translate: string;
   currency: string;
   price: number;
   description: string;
};

export type LocalStorageCartProduct = {
   id: number;
   translate: string;
   price: number;
};

export type DatabaseCartProduct = {
   id: number;
   category: Categories;
   image_url: string;
   quantity: number;
   translate: string;
   price: number;
};

export type Promotion = {
   id: number;
   title: string;
   touched_title: string;
   touched_text: string;
};

export type ResponseUserOrder = {
   id: number;
   cart: DatabaseCartProduct[];
   created_at: Date;
   status: OrderStatus;
   is_delivered: boolean;
   delivery_details: null | DeliveryDetails;
   total_cart_price: number;
   is_delivered_asap: boolean;
};

export interface VerifiedQueueOrder extends ResponseUserOrder {
   user: {
      phone_number: string;
      name: string;
   };
   isRunnerNotified?: boolean;
}
export interface WaitingQueueOrder extends ResponseUserOrder {
   user: {
      phone_number: string;
   };
}

export type OrderQueue = {
   waiting: WaitingQueueOrder[];
   verified: VerifiedQueueOrder[];
};

export enum Categories {
   PIZZA = "Пицца",
   DRINKS = "Напитки",
   DESSERT = "Дессерты",
   SUSHI = "Суши"
}

export interface ListResponse {
   cancel: VerifiedQueueOrder[];
   complete: VerifiedQueueOrder[];
}

export const PayMethods = ["online", "onPickup"] as const;
export type Pay = typeof PayMethods[number];

export type CreateUserOrderDto = {
   cart: DatabaseCartProduct[];
   delivery_details?: DeliveryDetails;
   is_delivered_asap: boolean;
   is_delivered: boolean;
   pay: Pay;
   email?: string;
   username?: string;
   promo?: string;
};

export type CustomerUser = {
   username?: string;
   delivery_details?: DeliveryDetails;
   phone_number: string;
};

export enum AggregationPreset {
   MONTH = "month",
   YEAR = "year",
   WEEK = "week"
}

export const AggregationPresetAmounts = new Map();

(function init() {
   AggregationPresetAmounts.set(AggregationPreset.YEAR, 365);
   AggregationPresetAmounts.set(AggregationPreset.MONTH, 30);
   AggregationPresetAmounts.set(AggregationPreset.WEEK, 7);
})();

export type Cart = DatabaseCartProduct[];

export type StatisticProduct = {
   translate: string;
   quantity: number;
};

export type StatisticCart = StatisticProduct[];

export type ProductTop = Map<string, number>;

export type TopProduct = {
   translate: string;
   percent: number;
   exactq: number; // exact quantity
};

export type ProductTopArray = TopProduct[];

export type Category = {
   category_id: number;
   name: string;
   rank: number;
};

export type MasterUser = {
   login: string;
   name: string;
   role: string;
};
export type RunnerUser = {
   username: string;
   phone_number: string;
};

export type ExternalEvent = {
   event_id: number;
   name: string;
   translate: string;
};
