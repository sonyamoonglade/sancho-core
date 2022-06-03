import {DatabaseCartProduct} from "../common/types";

export interface UserOrderFormFields {

    phone_number: {
        value: string
        isValid: boolean
    }
    is_delivered: {
        value: boolean
    }
    address?: {
        value: string
        isValid: boolean
    }
    entrance_number?: {
        value: string
        isValid: boolean
    }
    floor?: {
        value: string
        isValid: boolean
    }
    flat_call?: {
        value: string
        isValid: boolean
    }

}
export enum CategoryColor {
    'Напитки' = '#6fbecf',
    'Пицца'  = '#eb5757',
    'Закуски' = '#3cb46e'
}
export enum ProductCategories {
    pizza = 'Пицца',
    drinks = 'Напитки',
}

export interface CartInterface {

    addProduct(product: DatabaseCartProduct): void
    removeProduct(id: number): void
    getById(id: number): DatabaseCartProduct | undefined
    getCart(): DatabaseCartProduct[]
    clearCart(): void
    calculateCartTotalPrice(): number

}

export enum OrderStatusTranslate {
    waiting_for_verification = 'Ждет подтверждения',
    verified = 'Подтвержден',
    completed = 'Закрыт',
    cancelled = 'Отменен'
}

export const DATE_FORMAT_TEMPLATE = "DD MMM HH:mm"

export enum EventTypes {
    ORDER_CANCELLED = "order_cancelled"
}


export enum ScreenBreakpoints {
    large = 1440,
    medium = 1024,
    small = 768,
}

export enum AppResponsiveState {
    mobile,
    tabletOrComputer
}