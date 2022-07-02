import { Module } from "@nestjs/common";
import { MarkService } from "./mark.service";
import { MarkController } from "./mark.controller";
import { MarkRepository } from "./mark.repository";

@Module({
   controllers: [MarkController],
   providers: [MarkService, MarkRepository],
   exports: [MarkService]
})
export class MarkModule {}
