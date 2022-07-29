import { Injectable, Module } from "@nestjs/common";
import { EventEmitter } from "node:events";

@Injectable()
export class EventsService {
   private emitter: EventEmitter;

   GetEmitter(): EventEmitter {
      if (this.emitter === undefined) {
         this.emitter = new EventEmitter();
         return this.emitter;
      }
      return this.emitter;
   }
}

@Module({
   providers: [EventsService],
   exports: [EventsService]
})
export class EventsModule {}
