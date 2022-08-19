export class TooMuchSubscriptions extends Error {
   constructor(eventName: string) {
      super(`too much subscriptions for event ${eventName}`);
   }
}
