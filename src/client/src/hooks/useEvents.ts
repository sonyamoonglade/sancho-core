import { EventEmitter } from "events";

let emitter: EventEmitter;
export function useEvents() {
   if (!emitter) {
      emitter = new EventEmitter();
   }
   return emitter;
}
