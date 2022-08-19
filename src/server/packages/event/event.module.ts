import { Injectable, Module } from "@nestjs/common";
import { EventEmitter } from "node:events";

import { TooMuchSubscriptions } from "../exceptions/event.exceptions";
import { Events } from "./contract";

@Injectable()
export class EventsService {
   private readonly emitter: EventEmitter;

   constructor() {
      this.emitter = new EventEmitter();
   }

   Fire(event: string): void {
      this.emitter.emit(event);
      return;
   }

   Subscribe(event: string, callback: any): void {
      const ln = this.emitter.listeners(event).length;
      if (ln > 0) {
         throw new TooMuchSubscriptions(event);
      }
      this.emitter.on(event, callback);
      return;
   }
}

@Module({
   providers: [EventsService],
   exports: [EventsService]
})
export class EventsModule {}
