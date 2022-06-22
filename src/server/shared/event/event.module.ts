import { Module } from "@nestjs/common";
import { emitter } from "./event.provider-name";
import EventEmitter from "events";

const em = new EventEmitter();

const eventProvider = {
   useValue: em,
   provide: emitter
};

@Module({
   providers: [eventProvider]
})
export class EventModule {}
