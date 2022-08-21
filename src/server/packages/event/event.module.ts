import { Injectable, Module } from "@nestjs/common";

import { EventsService } from "./event.service";
import { EventsController } from "./event.controller";

@Module({
   controllers: [EventsController],
   providers: [EventsService],
   exports: [EventsService]
})
export class EventsModule {}
