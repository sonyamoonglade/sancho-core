import { Module } from "@nestjs/common";
import { ImageStorageService } from "./image_storage.service";

@Module({
   providers: [ImageStorageService]
})
export class ImageStorageModule {}
