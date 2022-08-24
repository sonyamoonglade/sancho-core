export class EventRO {
   name: string;
   translate: string;
   event_id: number;
}

export class SubscriptionRO {
   subscription_id: number;
   event: EventRO;
}

export class SubscriberRO {
   phone_number: string;
   subscriptions: SubscriptionRO;
   has_telegram_subscription: boolean;
}

export class SubscriberWithoutSubscriptionsRO {
   phone_number: string;
   has_telegram_subscription: boolean;
}
