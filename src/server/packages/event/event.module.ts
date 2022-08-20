import { Injectable, Module } from "@nestjs/common";

import { EventsService } from "./event.service";

@Module({
   providers: [EventsService],
   exports: [EventsService]
})
export class EventsModule {}
