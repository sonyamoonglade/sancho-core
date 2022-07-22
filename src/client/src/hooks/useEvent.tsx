import EventEmitter from "events";

let emitter: EventEmitter;

export function useEvent(): EventEmitter {
   if (!emitter) {
      emitter = new EventEmitter();
      return emitter;
   }

   return emitter;
}
