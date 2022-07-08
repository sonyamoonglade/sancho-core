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
   flat_call?: number;
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
   delivered_at: Date;
   is_paid: boolean;
};

export interface VerifiedQueueOrder extends ResponseUserOrder {
   user: {
      phone_number: string;
      name: string;
   };
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
   DRINKS = "Напитки"
}

export interface ListResponse {
   cancel: VerifiedQueueOrder[];
   complete: VerifiedQueueOrder[];
}
